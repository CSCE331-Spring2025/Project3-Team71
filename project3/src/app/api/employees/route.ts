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