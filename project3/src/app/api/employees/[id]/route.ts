import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(
  req: NextRequest,
  {params} : { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const parsedId = parseInt(id, 10);


  if (isNaN(parsedId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    await pool.query('DELETE FROM employees WHERE employee_id = $1', [id]);
    return NextResponse.json({ message: 'Employee deleted' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}
