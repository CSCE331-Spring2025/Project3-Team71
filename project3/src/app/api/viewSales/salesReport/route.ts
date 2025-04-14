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
      SELECT item, SUM(order_cost) AS total_sales
      FROM (
        SELECT unnest(items) AS item, order_cost
        FROM orders
        WHERE order_date BETWEEN $1::date AND $2::date
      ) AS expanded
      GROUP BY item
      ORDER BY total_sales DESC;
    `;

    const result = await Pool.query(query, [startDate, endDate]);

    const report = result.rows.map((row: any) => ({
      item_id: row.item,
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