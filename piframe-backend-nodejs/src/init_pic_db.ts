import pool from './pic_db';

async function init() {
  try {
    // Since PostgreSQL does not support "CREATE DATABASE IF NOT EXISTS",
    // you'll need to manually check if the database exists before trying to create it
    const dbCheckQuery = `SELECT 1 FROM pg_database WHERE datname = 'pic_db'`;
    const dbExistsResult = await pool.query(dbCheckQuery);

    if (dbExistsResult.rowCount === 0) {
      // Database doesn't exist, so create it
      await pool.query('CREATE DATABASE pic_db');
      console.log('✅ Database "pic_db" created');
    } else {
      console.log('✅ Database "pic_db" already exists');
    }

    // Now, ensure the 'images' table exists in the database
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        filepath TEXT NOT NULL,
        date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        comment TEXT,
        avg_rgb INTEGER[]
      );
    `;
    await pool.query(createTableQuery);
    console.log('✅ Table "images" is ready');
  } catch (err) {
    console.error('❌ Error initializing DB:', err);
  }
}

init();
