import { NextResponse } from 'next/server';
import Pool from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: 'Missing startDate or endDate' },
      { status: 400 }
    );
  }

  try {
    const result = await Pool.query(
      `
      SELECT
        o.order_id AS id,
        o.order_date,
        o.order_cost AS total,
        -- Return items as an array of item_ids (not names)
        o.items AS item_ids
      FROM orders o
      WHERE o.order_date BETWEEN $1 AND $2
      ORDER BY o.order_date;
      `,
      [startDate, endDate]
    );

    // Map the result to match the Order interface
    const orders = result.rows.map((row: any) => ({
      id: row.id,
      order_date: row.order_date,
      items: row.item_ids ? row.item_ids.map((itemId: number) => ({ item_id: itemId })) : [], // Change item names to item ids
      total: row.total,
    }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}