import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  const { items, note } = await req.json(); // [{ menuItemId, quantity }]

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let orderItemIds: number[] = [];
    let orderTotal = 0;
    
    for (const { menuItemId, quantity } of items) {
      const itemRes = await client.query(
        `SELECT sell_price, ingredients FROM menu_items WHERE item_id = $1`,
        [menuItemId]
      );
      const item = itemRes.rows[0];
      const price = item.sell_price;
      const ingredientIds: number[] = item.ingredients;
    
      for (let i = 0; i < quantity; i++) {
        orderItemIds.push(menuItemId);
      }
      orderTotal += price * quantity;
    
      for (const id of ingredientIds) {
        await client.query(
          `UPDATE ingredients
           SET ingredient_amount = ingredient_amount - $1,
               items_sold = COALESCE(items_sold, 0) + $1
           WHERE ingredient_id = $2`,
          [quantity, id]
        );
      }
    }
    
    // Insert into orders table
    await client.query(
      `INSERT INTO orders (items, order_cost, note, order_date)
       VALUES ($1, $2, $3, NOW())`,
      [orderItemIds, orderTotal, note || null]
    );    


    await client.query('COMMIT');
    return NextResponse.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Checkout error:', err);
  
    // Ensure err is an Error type
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
   finally {
    client.release();
  }
}


