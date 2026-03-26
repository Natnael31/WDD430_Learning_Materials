import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testDatabase() {
  console.log("🔍 Testing Database Connection...\n");

  try {
    // Test 1: Basic connection
    console.log("1. Testing connection...");
    const timeResult = await pool.query("SELECT NOW() as current_time");
    console.log("   Connected successfully!");
    console.log(`   Database time: ${timeResult.rows[0].current_time}\n`);

    // Test 2: Check if products table exists
    console.log("2. Checking products table...");
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'products'
      ) as exists;
    `);

    if (tableCheck.rows[0].exists) {
      console.log("Products table exists");

      // Get table structure
      const columns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'products'
        ORDER BY ordinal_position;
      `);

      console.log("   Table columns:");
      columns.rows.forEach((col) => {
        console.log(`     - ${col.column_name}: ${col.data_type}`);
      });

      // Count existing products
      const countResult = await pool.query(
        "SELECT COUNT(*) as count FROM products",
      );
      console.log(`Current products count: ${countResult.rows[0].count}\n`);
    } else {
      console.log("Products table does not exist");
      console.log("Run: pnpm setup-db first\n");
    }

    // Test 3: Check if reviews table exists
    console.log("3. Checking reviews table...");
    const reviewsTableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'reviews'
      ) as exists;
    `);

    if (reviewsTableCheck.rows[0].exists) {
      console.log("Reviews table exists");

      const reviewsCount = await pool.query(
        "SELECT COUNT(*) as count FROM reviews",
      );
      console.log(`Current reviews count: ${reviewsCount.rows[0].count}\n`);
    } else {
      console.log("Reviews table does not exist\n");
    }

    // Test 4: Show existing products (if any)
    if (tableCheck.rows[0].exists) {
      const existingProducts = await pool.query(`
        SELECT id, name, price, is_featured, rating 
        FROM products 
        LIMIT 5
      `);

      if (existingProducts.rows.length > 0) {
        console.log("4. Existing products:");
        existingProducts.rows.forEach((product) => {
          console.log(`   ${product.id}. ${product.name}`);
          console.log(`      Price: $${product.price}`);
          console.log(`      Featured: ${product.is_featured ? "Yes" : "No"}`);
          console.log(`      Rating: ${product.rating}★\n`);
        });
      } else {
        console.log("4. No products found in database");
        console.log("   Run: pnpm seed to add sample products\n");
      }
    }

    console.log("Database test completed successfully!");
  } catch (error) {
    console.error("Database test failed:", error);
  } finally {
    await pool.end();
  }
}

testDatabase();
