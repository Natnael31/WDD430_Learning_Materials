import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const productId = parseInt(id);

    // Check if product exists
    const checkProduct = await query("SELECT id FROM products WHERE id = $1", [
      productId,
    ]);
    if (checkProduct.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Insert review
    const sql = `
      INSERT INTO reviews (product_id, rating, comment, reviewer_name)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const params_array = [
      productId,
      parseInt(body.rating),
      body.comment,
      body.reviewerName || "Anonymous",
    ];

    const result = await query(sql, params_array);

    // Get updated product with new rating
    const updatedProduct = await query(
      `
      SELECT * FROM products WHERE id = $1
    `,
      [productId],
    );

    return NextResponse.json(
      {
        review: result.rows[0],
        product: updatedProduct.rows[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { error: "Failed to add review" },
      { status: 500 },
    );
  }
}
