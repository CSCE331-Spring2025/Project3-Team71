import { NextResponse } from 'next/server';
import Pool from "@/lib/db";

export async function GET() {
  try {
    const result = await Pool.query(`
      SELECT employee_id AS id, name, employee_wage, last_sign_in, time_worked, email
      FROM employees
      ORDER BY employee_id
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { employee_id, name, employee_wage, last_sign_in, time_worked, email } = body;

    await Pool.query(
      `INSERT INTO employees (employee_id, name, employee_wage, last_sign_in, time_worked, email)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [employee_id, name, employee_wage, last_sign_in || null, time_worked || null, email]
    );

    return NextResponse.json({ message: "Employee added" });
  } catch (error) {
    console.error('Error adding employee:', error);
    return NextResponse.json({ error: 'Failed to add employee' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, employee_wage, last_sign_in, time_worked, email } = body;

    await Pool.query(
      `UPDATE employees
       SET name = $1,
           employee_wage = $2,
           last_sign_in = $3,
           time_worked = $4,
           email = $5
       WHERE employee_id = $6`,
      [name, employee_wage, last_sign_in || null, time_worked || null, email, id]
    );

    return NextResponse.json({ message: "Employee updated" });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await Pool.query(`DELETE FROM employees WHERE employee_id = $1`, [id]);

    return NextResponse.json({ message: "Employee deleted" });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}
