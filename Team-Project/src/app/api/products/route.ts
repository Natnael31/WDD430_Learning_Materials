import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    let sql = "SELECT * FROM products";
    const params: any[] = [];
    const conditions: string[] = [];

    if (category) {
      conditions.push(`category = $${params.length + 1}`);
      params.push(category);
    }

    if (featured === "true") {
      conditions.push(`is_featured = $${params.length + 1}`);
      params.push(true);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY created_at DESC";

    const result = await query(sql, params);

    // Convert snake_case to camelCase for frontend
    const products = result.rows.map((product: any) => ({
      id: product.id,
      name: product.name,
      artisan: product.artisan,
      category: product.category,
      price: parseFloat(product.price),
      currency: product.currency,
      rating: parseFloat(product.rating),
      reviews: product.reviews,
      image: product.image,
      isFeatured: product.is_featured,
      description: product.description,
      location: product.location,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const sql = `
      INSERT INTO products (
        name, artisan, category, price, currency, 
        rating, reviews, image, is_featured, description, location
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const params = [
      body.name,
      body.artisan,
      body.category,
      parseFloat(body.price),
      body.currency || "USD",
      parseFloat(body.rating) || 0,
      parseInt(body.reviews) || 0,
      body.image,
      body.isFeatured === true || body.isFeatured === "true",
      body.description,
      body.location,
    ];

    const result = await query(sql, params);
    const product = result.rows[0];

    // Convert to camelCase for response
    const newProduct = {
      id: product.id,
      name: product.name,
      artisan: product.artisan,
      category: product.category,
      price: parseFloat(product.price),
      currency: product.currency,
      rating: parseFloat(product.rating),
      reviews: product.reviews,
      image: product.image,
      isFeatured: product.is_featured,
      description: product.description,
      location: product.location,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
