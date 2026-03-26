import { Pool } from "pg";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Check if products already exist
    const checkResult = await pool.query("SELECT COUNT(*) FROM products");
    const existingCount = parseInt(checkResult.rows[0].count);

    if (existingCount > 0) {
      console.log(
        `Database already has ${existingCount} products. Skipping seed.`,
      );
      console.log("To re-seed, run: TRUNCATE products CASCADE;");
      await pool.end();
      return;
    }

    const products = [
      {
        name: "Handwoven Cotton Scarf",
        artisan: "Maria Lopez",
        category: "Textiles",
        price: 25.99,
        image: "/products/hg1.webp",
        description:
          "A soft, handwoven cotton scarf made using traditional techniques.",
        location: "Guatemala",
        is_featured: true,
        rating: 4.8,
        reviews: 34,
      },
      {
        name: "Ceramic Coffee Mug",
        artisan: "John Carter",
        category: "Pottery",
        price: 18.5,
        image: "/products/hg2.webp",
        description: "Handcrafted ceramic mug with a rustic glaze finish.",
        location: "USA",
        is_featured: true,
        rating: 4.6,
        reviews: 21,
      },
      {
        name: "Leather Journal",
        artisan: "Aisha Khan",
        category: "Stationery",
        price: 32.0,
        image: "/products/hg3.webp",
        description:
          "Premium handmade leather journal with recycled paper pages.",
        location: "Morocco",
        is_featured: true,
        rating: 4.9,
        reviews: 12,
      },
      {
        name: "Beaded Bracelet",
        artisan: "Carlos Mendez",
        category: "Jewelry",
        price: 12.75,
        image: "/products/hg4.webp",
        description: "Colorful handmade bracelet crafted with glass beads.",
        location: "Mexico",
        is_featured: false,
        rating: 4.5,
        reviews: 18,
      },
    ];

    for (const product of products) {
      const sql = `
        INSERT INTO products (
          name, artisan, category, price, currency, rating, reviews, 
          image, is_featured, description, location
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `;

      await pool.query(sql, [
        product.name,
        product.artisan,
        product.category,
        product.price,
        "USD",
        product.rating,
        product.reviews,
        product.image,
        product.is_featured,
        product.description,
        product.location,
      ]);

      console.log(`✓ Added product: ${product.name}`);
    }

    console.log("✅ Database seeding completed successfully!");

    // Verify
    const result = await pool.query("SELECT COUNT(*) FROM products");
    console.log(`Total products in database: ${result.rows[0].count}`);

    // Show all products
    const allProducts = await pool.query(
      "SELECT id, name, price, rating FROM products",
    );
    console.log("\nProducts in database:");
    allProducts.rows.forEach((p) => {
      console.log(`  - ${p.id}: ${p.name} - $${p.price} (${p.rating}★)`);
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await pool.end();
  }
}

seedDatabase();
