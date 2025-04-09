import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemIdParam = searchParams.get('item_id');

    if (!itemIdParam) {
      return NextResponse.json({ error: 'Missing item_id parameter' }, { status: 400 });
    }

    const itemId = parseInt(itemIdParam, 10);
    if (isNaN(itemId)) {
      return NextResponse.json({ error: 'Invalid item_id' }, { status: 400 });
    }

    // Ingredients to exclude from response
    const EXCLUDED = ['Cups', 'Straws', 'Plastic Bags', 'Ice', 'Napkins'];

    if (itemId === 0) {
      const allIngredientsQuery = `
        SELECT ingredient_id, ingredient_name 
        FROM ingredients
        WHERE ingredient_name NOT IN (${EXCLUDED.map((_, i) => `$${i + 1}`).join(',')})
      `;
      const allIngredientsResult = await pool.query(allIngredientsQuery, EXCLUDED);

      const allIngredients = allIngredientsResult.rows.map(row => ({
        ingredient_id: row.ingredient_id,
        name: row.ingredient_name,
      }));

      return NextResponse.json({ ingredients: allIngredients }, { status: 200 });
    }

    // For a specific menu item
    const menuQuery = `SELECT ingredients FROM menu_items WHERE item_id = $1`;
    const menuResult = await pool.query(menuQuery, [itemId]);

    if (menuResult.rows.length === 0) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    const ingredientIds = menuResult.rows[0].ingredients;

    if (!ingredientIds || ingredientIds.length === 0) {
      return NextResponse.json({ ingredients: [] }, { status: 200 });
    }

    const ingredientQuery = `
      SELECT ingredient_id, ingredient_name 
      FROM ingredients 
      WHERE ingredient_id = ANY($1)
      AND ingredient_name NOT IN (${EXCLUDED.map((_, i) => `$${i + 2}`).join(',')})
    `;
    const ingredientResult = await pool.query(
      ingredientQuery,
      [ingredientIds, ...EXCLUDED]
    );

    const selectedIngredients = ingredientResult.rows.map(row => ({
      ingredient_id: row.ingredient_id,
      name: row.ingredient_name,
    }));

    return NextResponse.json({ ingredients: selectedIngredients }, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
