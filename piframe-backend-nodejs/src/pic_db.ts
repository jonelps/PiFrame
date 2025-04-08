import { Pool } from 'pg';

// Create a pool instance to manage PostgreSQL connections
const pool = new Pool({
  user: 'postgres',         // PostgreSQL user
  host: 'localhost',        // PostgreSQL server host (localhost if running locally)
  database: 'pic_db',       // Database name (ensure this matches your database)
  password: 'party1581',    // Database password
  port: 5432,               // PostgreSQL port (default is 5432)
});

export default pool;
