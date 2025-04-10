import { NextResponse } from 'next/server';
import Pool from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { quantity, min_amount } = body;

    // Dynamically build SQL query based on which fields are provided
    const updates = [];
    const values: any[] = [];

    if (typeof quantity === 'number') {
      updates.push('ingredient_amount = $' + (values.length + 1));
      values.push(quantity);
    }

    if (typeof min_amount === 'number') {
      updates.push('min_amount = $' + (values.length + 1));
      values.push(min_amount);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    values.push(id);
    const query = `
      UPDATE ingredients
      SET ${updates.join(', ')}
      WHERE ingredient_id = $${values.length}
    `;

    await Pool.query(query, values);

    return NextResponse.json({ message: 'Inventory item updated' });
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}
