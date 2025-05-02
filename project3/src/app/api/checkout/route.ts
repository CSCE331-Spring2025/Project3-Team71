import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  const { items, note, customer_name, employee_id } = await req.json(); // [{ menuItemId, quantity }] , npote, customer_name, employee_id
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const hhRes = await client.query(`
      SELECT * FROM happy_hour_settings
      WHERE NOW() BETWEEN start_datetime AND end_datetime
      ORDER BY end_datetime DESC
      LIMIT 1
    `);
    const isHappyHour = (hhRes.rowCount ?? 0) > 0;

    let orderItemIds: number[] = [];
    let orderTotal = 0;
    let orderProfit = 0;

    for (const { menuItemId, quantity } of items) {
      // Existing code for order processing...
      const itemRes = await client.query(
        `SELECT sell_price, buy_price, happy_hour_price, ingredients 
         FROM menu_items WHERE item_id = $1`,
        [menuItemId]
      );
      const item = itemRes.rows[0];
      const price = isHappyHour ? item.happy_hour_price : item.sell_price;
      const itemProfit = price - item.buy_price; // Calculate profit for the item

      for (let i = 0; i < quantity; i++) {
        orderItemIds.push(menuItemId);
      }
      orderTotal += price * quantity;
      orderProfit += itemProfit * quantity; // Add item profit to total order profit

      for (const ingredientId of item.ingredients) {
        await client.query(
          `UPDATE ingredients
           SET ingredient_amount = ingredient_amount - $1,
               items_sold = COALESCE(items_sold, 0) + $1
           WHERE ingredient_id = $2`,
          [quantity, ingredientId]
        );
      }
    }

    // Update query to include employee_id column
    await client.query(
      `INSERT INTO orders (items, order_cost, order_profit, note, order_date, customer_name, employee_id)
       VALUES ($1, $2, $3, $4, NOW(), $5, $6)`,
      [orderItemIds, orderTotal, orderProfit, note || null, customer_name || 'Walk-in', employee_id || null]
    );

    await client.query('COMMIT');
    return NextResponse.json({ success: true });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  } finally {
    client.release();
  }
}