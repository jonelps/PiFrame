CREATE DATABASE pic_db;

\c pic_db;

CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        filepath TEXT NOT NULL,
        date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        comment TEXT,
        avg_rgb INTEGER[]
      );