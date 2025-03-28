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
