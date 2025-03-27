import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT 
        mi.item_id, 
        mi.item_name, 
        mi.item_type, 
        mi.sell_price,
        CASE 
          WHEN mi.ingredients IS NULL THEN NULL
          ELSE (
            SELECT json_agg(json_build_object('id', i.ingredient_id, 'name', i.ingredient_name))
            FROM ingredients i
            WHERE i.ingredient_id = ANY(mi.ingredients::int[])
          )
        END as ingredients
      FROM menu_items mi;
    `;
    const result = await pool.query(query);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}