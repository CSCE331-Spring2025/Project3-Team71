import { NextResponse } from 'next/server';
import Pool from '@/lib/db';  // Assuming this is your PostgreSQL connection pool

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: 'Missing startDate or endDate' },
      { status: 400 }
    );
  }

  try {
    // Get all items ordered within the date range
    const orderItemsQuery = `
      SELECT unnest(items)::integer AS item_id
      FROM orders
      WHERE order_date BETWEEN $1 AND $2;
    `;
    const orderItemsResult = await Pool.query(orderItemsQuery, [startDate, endDate]);

    // Store ingredient usage counts
    const ingredientUsageCounts: { [key: string]: number } = {};

    // Loop through each ordered item to calculate ingredient usage
    for (let row of orderItemsResult.rows) {
      const itemId = row.item_id;

      // Get ingredients for each item
      const ingredientsQuery = `
        SELECT unnest(ingredients)::integer AS ingredient_id
        FROM menu_items
        WHERE item_id = $1;
      `;
      const ingredientsResult = await Pool.query(ingredientsQuery, [itemId]);

      for (let ingredientRow of ingredientsResult.rows) {
        const ingredientId = ingredientRow.ingredient_id;

        // Get ingredient name
        const ingredientNameQuery = `
          SELECT ingredient_name
          FROM ingredients
          WHERE ingredient_id = $1;
        `;
        const ingredientNameResult = await Pool.query(ingredientNameQuery, [ingredientId]);

        let ingredientName = `Ingredient #${ingredientId}`;
        if (ingredientNameResult.rows.length > 0) {
          ingredientName = ingredientNameResult.rows[0].ingredient_name;
        }

        // Increment the usage count for this ingredient
        if (ingredientUsageCounts[ingredientName]) {
          ingredientUsageCounts[ingredientName] += 1;
        } else {
          ingredientUsageCounts[ingredientName] = 1;
        }
      }
    }

    // Convert the ingredient usage counts to a list
    const usageList = Object.keys(ingredientUsageCounts).map((ingredient) => ({
      ingredient,
      usage_count: ingredientUsageCounts[ingredient],
    }));

    return NextResponse.json(usageList);
  } catch (error) {
    console.error('Error fetching product usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product usage' },
      { status: 500 }
    );
  }
}