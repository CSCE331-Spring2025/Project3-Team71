import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query(`SELECT * FROM happy_hour_settings ORDER BY start_datetime DESC`);
  return NextResponse.json(result.rows);
}
