import pool from './pic_db';

async function init() {
  try {
    // Assume DB already exists

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
