import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool(); // Uses DB credentials from .env.local

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received request body:", body);

    const { items } = body;

    // Validate items structure
    if (!Array.isArray(items) || items.length === 0) {
      console.warn("Invalid or empty items array");
      return NextResponse.json({ error: 'Invalid items array' }, { status: 400 });
    }

    // Validate entries before using them in the DB
    const sanitizedItems = items
      .filter(item =>
        typeof item.ingredient_id === 'number' &&
        typeof item.quantityUsed === 'number' &&
        item.quantityUsed > 0
      );

    if (sanitizedItems.length === 0) {
      console.warn("All items invalid after sanitization");
      return NextResponse.json({ error: 'All items invalid' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const { ingredient_id, quantityUsed } of sanitizedItems) {
        console.log(`Updating ingredient_id ${ingredient_id} by -${quantityUsed}`);

        await client.query(
          `
          UPDATE ingredients
          SET 
            ingredient_amount = ingredient_amount - $1,
            items_sold = COALESCE(items_sold, 0) + $1
          WHERE ingredient_id = $2
          `,
          [quantityUsed, ingredient_id]
        );
      }

      await client.query('COMMIT');
      return NextResponse.json({ message: 'Inventory updated successfully' });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error("DB Error:", err);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("JSON parse or request error:", err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
