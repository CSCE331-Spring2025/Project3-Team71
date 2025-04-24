import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  try {
    await pool.query(`DELETE FROM happy_hour_settings WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete happy hour:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
