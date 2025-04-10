import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        ingredient_id AS id,
        ingredient_name AS name,
        ingredient_amount AS quantity,
        ingredient_cost AS cost,
        min_amount,
        items_sold
      FROM ingredients
      ORDER BY ingredient_name
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}