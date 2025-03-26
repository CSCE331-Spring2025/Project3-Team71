export async function GET(req: NextRequest, { params }: { params: Record<string, string> }) {
  try {
    const itemName = decodeURIComponent(params.itemName);
    const query = `
      SELECT item_name, array_length(ingredients, 1) AS total_ingredients
      FROM Menu_Items
      WHERE item_name = $1;
    `;
    const values = [itemName];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
