import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ item_id: string }> }
) {
  const { item_id } = await params;
  const itemId = parseInt(item_id, 10);

  if (isNaN(itemId)) {
    return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
  }

  try {
    const query = `
      SELECT kcal, saturated_fat_g, sodium_mg, carbs_g, sugar_g, 
             vegetarian_foods, allergen, caffeine_mg 
      FROM menu_items 
      WHERE item_id = $1
    `;
    const result = await pool.query(query, [itemId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
