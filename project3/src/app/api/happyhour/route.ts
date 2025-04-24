import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// POST: Store happy hour range
export async function POST(req: NextRequest) {
  const { start_datetime, end_datetime } = await req.json();

  try {
    await pool.query(
      `INSERT INTO happy_hour_settings (start_datetime, end_datetime) VALUES ($1, $2)`,
      [start_datetime, end_datetime]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

// GET: Retrieve most recent happy hour
export async function GET() {
  const result = await pool.query(`
    SELECT * FROM happy_hour_settings
    ORDER BY end_datetime DESC
    LIMIT 1
  `);

  return NextResponse.json(result.rows[0] || {});
}
