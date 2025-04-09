import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ item_id: string }> }
) {
  const { item_id } = await params;
  const itemId = parseInt(item_id, 10);

  if (isNaN(itemId)) {
    return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
  }

  const { item_name, sell_price, ingredients } = await req.json();

  if (!item_name || !sell_price || !Array.isArray(ingredients)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    await pool.query(
      `UPDATE menu_items 
       SET item_name = $1, sell_price = $2, ingredients = $3 
       WHERE item_id = $4`,
      [item_name, sell_price, ingredients, itemId]
    );
    return NextResponse.json({ message: 'Item updated successfully' }, { status: 200 });
  } catch (err) {
    console.error('Update error:', err);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ item_id: string }> }
) {
  const { item_id } = await params;
  const itemId = parseInt(item_id, 10);

  if (isNaN(itemId)) {
    return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
  }

  try {
    await pool.query(`DELETE FROM menu_items WHERE item_id = $1`, [itemId]);
    return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
