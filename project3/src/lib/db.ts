import { Pool } from 'pg';

const pool = new Pool({
  user: 'team_71',
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
});

export default pool;