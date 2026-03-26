import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const productSql = "SELECT * FROM products WHERE id = $1";
    const productResult = await query(productSql, [parseInt(id)]);

    if (productResult.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = productResult.rows[0];

    // Get reviews for this product
    const reviewsSql = `
      SELECT * FROM reviews 
      WHERE product_id = $1 
      ORDER BY created_at DESC
    `;
    const reviewsResult = await query(reviewsSql, [parseInt(id)]);

    const formattedProduct = {
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
      reviewsList: reviewsResult.rows.map((review: any) => ({
        id: review.id,
        productId: review.product_id,
        rating: review.rating,
        comment: review.comment,
        reviewerName: review.reviewer_name,
        createdAt: review.created_at,
      })),
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const sql = `
      UPDATE products 
      SET 
        name = $1, 
        artisan = $2, 
        category = $3, 
        price = $4,
        currency = $5, 
        rating = $6, 
        reviews = $7, 
        image = $8,
        is_featured = $9, 
        description = $10, 
        location = $11,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
    `;

    const params_array = [
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
      parseInt(id),
    ];

    const result = await query(sql, params_array);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = result.rows[0];

    const updatedProduct = {
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
      updatedAt: product.updated_at,
    };

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const sql = "DELETE FROM products WHERE id = $1 RETURNING *";
    const result = await query(sql, [parseInt(id)]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
