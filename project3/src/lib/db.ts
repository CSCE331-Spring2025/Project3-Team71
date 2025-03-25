import { Pool } from 'pg';

const pool = new Pool({
  user: 'team_71',
  host: 'csce-315-db.engr.tamu.edu',
  database: 'team_71_db',
  password: 'Team71Rox',
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

export default pool;
