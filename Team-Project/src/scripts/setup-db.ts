import { Pool } from "pg";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function setupDatabase() {
  try {
    console.log("Starting database setup...");

    // Simple schema without triggers
    const schema = `
      -- Drop existing tables if they exist
      DROP TABLE IF EXISTS reviews CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      
      -- Create products table
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        artisan VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        rating DECIMAL(3, 2) DEFAULT 0,
        reviews INTEGER DEFAULT 0,
        image TEXT NOT NULL,
        is_featured BOOLEAN DEFAULT FALSE,
        description TEXT NOT NULL,
        location VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Create reviews table
      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        reviewer_name VARCHAR(255) DEFAULT 'Anonymous',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
      CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
    `;

    // Split schema into individual statements
    const statements = schema.split(";").filter((stmt) => stmt.trim());

    console.log(`Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        try {
          await pool.query(statement);
          console.log(`✓ Executed statement ${i + 1}/${statements.length}`);
        } catch (err) {
          console.error(`✗ Error executing statement ${i + 1}:`, err);
        }
      }
    }

    console.log("Database setup completed successfully!");

    // Test connection
    const result = await pool.query("SELECT NOW() as current_time");
    console.log("Database time:", result.rows[0].current_time);
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await pool.end();
  }
}

setupDatabase();
