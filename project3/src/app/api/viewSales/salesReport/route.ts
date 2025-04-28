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
    console.log(`Fetching sales report from ${startDate} to ${endDate}`);

    const query = `
      SELECT mi.item_name AS item, SUM(expanded.order_cost) AS total_sales
      FROM (
        SELECT unnest(items)::integer AS item_id, order_cost
        FROM orders
        WHERE order_date >= $1
          AND order_date < ($2::date + INTERVAL '1 day')
      ) AS expanded
      JOIN menu_items mi ON mi.item_id = expanded.item_id
      GROUP BY mi.item_name
      ORDER BY total_sales DESC;
    `;

    const result = await Pool.query(query, [startDate, endDate]);

    const report = result.rows.map((row: any) => ({
      item: row.item, // now this is the item_name
      total_sales: parseFloat(row.total_sales)
    }));

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error generating sales report:', error);
    return NextResponse.json(
      { error: 'Failed to generate sales report' },
      { status: 500 }
    );
  }
}
