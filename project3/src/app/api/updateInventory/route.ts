import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool(); // Uses DB credentials from .env.local

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received inventory update request:", body);

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

    console.log("Sanitized items for update:", sanitizedItems);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const lowInventoryItems = [];
      const updatedItems = [];

      // First verify all ingredients exist and have sufficient quantity
      for (const { ingredient_id, quantityUsed } of sanitizedItems) {
        const checkResult = await client.query(
          'SELECT ingredient_id, ingredient_name, ingredient_amount, min_amount FROM ingredients WHERE ingredient_id = $1',
          [ingredient_id]
        );
        
        if (checkResult.rows.length === 0) {
          throw new Error(`Ingredient ID ${ingredient_id} not found in database`);
        }
        
        const ingredient = checkResult.rows[0];
        console.log(`Checking ${ingredient.ingredient_name}: current=${ingredient.ingredient_amount}, needed=${quantityUsed}`);
        
        if (ingredient.ingredient_amount < quantityUsed) {
          throw new Error(`Not enough inventory for ${ingredient.ingredient_name} (ID: ${ingredient_id}). Requested: ${quantityUsed}, Available: ${ingredient.ingredient_amount}`);
        }
        
        // Check if the update would put inventory below minimum threshold
        if (ingredient.ingredient_amount - quantityUsed < ingredient.min_amount) {
          lowInventoryItems.push({
            id: ingredient_id,
            name: ingredient.ingredient_name,
            remaining: ingredient.ingredient_amount - quantityUsed,
            minimum: ingredient.min_amount
          });
        }
      }

      // Then perform all updates
      for (const { ingredient_id, quantityUsed } of sanitizedItems) {
        console.log(`Updating ingredient_id ${ingredient_id} by -${quantityUsed}`);

        const updateResult = await client.query(
          `
          UPDATE ingredients
          SET 
            ingredient_amount = ingredient_amount - $1,
            items_sold = COALESCE(items_sold, 0) + $1
          WHERE ingredient_id = $2
          RETURNING ingredient_id, ingredient_name, ingredient_amount
          `,
          [quantityUsed, ingredient_id]
        );
        
        updatedItems.push(updateResult.rows[0]);
      }

      await client.query('COMMIT');
      console.log("Transaction committed successfully");
      
      return NextResponse.json({ 
        message: 'Inventory updated successfully',
        updatedItems,
        lowInventoryItems: lowInventoryItems.length > 0 ? lowInventoryItems : null
      });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error("DB Error:", err);
      return NextResponse.json({ 
        error: err instanceof Error ? err.message : 'Database error' 
      }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("JSON parse or request error:", err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}