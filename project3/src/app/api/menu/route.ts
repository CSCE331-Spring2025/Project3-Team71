import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const query = `SELECT item_id, item_name, item_type, sell_price FROM menu_items`;
    const result = await pool.query(query);
    
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { item_name, item_type, sell_price, ingredients } = await req.json();

  if (!item_name || !item_type || !sell_price || !Array.isArray(ingredients)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    const query = `INSERT INTO menu_items (item_name, item_type, sell_price, ingredients) VALUES ($1, $2, $3, $4)`;
    await pool.query(query, [item_name, item_type, sell_price, ingredients]);

    return NextResponse.json({ message: 'Item added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
