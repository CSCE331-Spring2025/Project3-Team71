import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Extract item_id from query parameters
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('item_id');

    if (!itemId) {
      return NextResponse.json({ error: 'Missing item_id parameter' }, { status: 400 });
    }

    // Fetch ingredient IDs from the menu_items table
    const menuQuery = `SELECT ingredients FROM menu_items WHERE item_id = $1`;
    const menuResult = await pool.query(menuQuery, [itemId]);

    if (menuResult.rows.length === 0) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    const ingredientIds = menuResult.rows[0].ingredients;

    if (!ingredientIds || ingredientIds.length === 0) {
      return NextResponse.json({ ingredients: [] }, { status: 200 });
    }

    // Fetch ingredient names based on ingredient IDs
    const ingredientQuery = `SELECT ingredient_name FROM ingredients WHERE ingredient_id = ANY($1)`;
    const ingredientResult = await pool.query(ingredientQuery, [ingredientIds]);

    // Map the result to get the ingredient names
    const ingredientNames = ingredientResult.rows.map(row => row.ingredient_name);

    // Filter out unwanted ingredients (Cup, Straw, Plastic Bag, Ice)
    const filteredIngredients = ingredientNames.filter(name => 
      !['Cups', 'Straws', 'Plastic Bags', 'Ice'].includes(name)
    );

    return NextResponse.json({ ingredients: filteredIngredients }, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}