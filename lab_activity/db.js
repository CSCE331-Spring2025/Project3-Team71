const {Pool} = require('pg');
const pool = new Pool({
    user: 'team_71',
    host: 'csce-315-db.engr.tamu.edu',
    database: 'team_71_db',
    password: 'Team71Rox',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});


module.exports = {
    query: (text, params) => pool.query(text, params)
};