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
        (
          SELECT ARRAY_AGG(mi.item_name ORDER BY mi.item_name)
          FROM UNNEST(o.items) AS u(item_id)
          LEFT JOIN menu_items mi ON mi.item_id = u.item_id
          WHERE mi.item_name IS NOT NULL
        ) AS items
      FROM orders o
      WHERE o.order_date >= $1
        AND o.order_date < ($2::date + INTERVAL '1 day')
      ORDER BY o.order_date;
      `,
      [startDate, endDate]
    );

    // Map the result to match the Order interface
    const orders = result.rows.map((row: any) => ({
      id: row.id,
      order_date: row.order_date,
      items: row.items ?? [],
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