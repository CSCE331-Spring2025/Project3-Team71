const {Pool} = require('pg');
const pool = new Pool({
    user: 'team_71',
    host: 'csce-315-db.engr.tamu.edu',
    database: 'team_71_db',
    password: 'Team71Rox',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});

export async function GET() {
    const client = await pool.connect();
    try {
        const res = await client.query(
            'SELECT * FROM menu_items'
        );
        return new Response(JSON.stringify(res.rows), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response('Error fetching menu', { status: 500 });
    } finally {
        client.release();
    }
}


