import { NextResponse } from 'next/server';
import Pool from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);
    const { quantity } = await request.json();
  
    if (isNaN(id) || typeof quantity !== 'number') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
  
    try {
      await Pool.query(
        'UPDATE ingredients SET ingredient_amount = $1 WHERE ingredient_id = $2',
        [quantity, id]
      );
      return NextResponse.json({ message: 'Inventory updated' });
    } catch (error) {
      console.error('Error updating inventory:', error);
      return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
    }
  }