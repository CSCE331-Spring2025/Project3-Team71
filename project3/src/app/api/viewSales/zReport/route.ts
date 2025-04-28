import { NextResponse } from 'next/server';
import Pool from '@/lib/db'; // PostgreSQL connection pool

export async function POST(req: Request) {
  try {
    // Query to get total sales and total profit for today
    const query = `
        SELECT 'Total Sales' AS category, SUM(order_cost) AS total 
        FROM orders 
        WHERE order_date::date = CURRENT_DATE AND z_report = false
        UNION ALL
        SELECT 'Total Profit' AS category, SUM(order_profit) AS total 
        FROM orders 
        WHERE order_date::date = CURRENT_DATE AND z_report = false;
    `;

    console.log('Executing query:', query);

    // Execute the query to get the totals
    const result = await Pool.query(query);

    // Log the raw result to troubleshoot
    console.log('Query result:', result.rows);

    // Ensure the result has data and format the total values
    const totalSales = result.rows[0] ? parseFloat(result.rows[0].total).toFixed(2) : '0.00';
    const totalProfits = result.rows[1] ? parseFloat(result.rows[1].total).toFixed(2) : '0.00';

    // Log the final formatted totals
    console.log('Total Sales:', totalSales);
    console.log('Total Profits:', totalProfits);

    // Query toupdate orders for today and changing z repor to true
    const updateQuery = `
        UPDATE orders
        SET z_report = true
        WHERE order_date::date = CURRENT_DATE
          AND z_report = false;
    `;
    console.log('Executing delete query:', updateQuery);

    // Run the update query
    await Pool.query(updateQuery);

    // Return the response with the totals
    return NextResponse.json({
      total_sales: totalSales,
      total_profits: totalProfits,
    });
  } catch (error) {
    console.error('Error fetching Z Report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Z Report' },
      { status: 500 }
    );
  }
}