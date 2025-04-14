import { NextResponse } from 'next/server';
import Pool from '@/lib/db'; // PostgreSQL connection pool

export async function GET(req: Request) {
  try {
    // Extract the date parameter from the query string
    const url = new URL(req.url);
    const date = url.searchParams.get('date');  // Get the 'date' query parameter

    if (!date) {
      // If no date is provided, return an error response
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    // Query to get the sales data for the provided date
    const query = `
      SELECT 
        EXTRACT(HOUR FROM order_date) AS hour,
        SUM(order_cost) AS total_sales
      FROM orders
      WHERE order_date::date = $1  -- Filter by the provided date
      GROUP BY hour
      ORDER BY hour;
    `;

    // Execute the query with the provided date
    const result = await Pool.query(query, [date]);

    const formattedData = result.rows.map((row) => ({
      hour: `${row.hour}:00`,
      total_sales: parseFloat(row.total_sales).toFixed(2),
    }));

    // Return the formatted sales data as a JSON response
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching X Report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch X Report' },
      { status: 500 }
    );
  }
}