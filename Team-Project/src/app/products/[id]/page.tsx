"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./productDetail.module.css";

interface Product {
  id: number;
  name: string;
  artisan: string;
  category: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  image: string;
  isFeatured: boolean;
  description: string;
  location: string;
  reviewsList?: Review[];
}

interface Review {
  id: number;
  productId: number;
  rating: number;
  comment: string;
  reviewerName: string;
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState({
    rating: 5,
    comment: "",
    reviewerName: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/products/${params.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      setReview({ rating: 5, comment: "", reviewerName: "" });
      fetchProduct();
    } catch (err) {
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!product) return <div className={styles.error}>Product not found</div>;

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backButton}>
        ← Back to Products
      </button>

      <div className={styles.productDetail}>
        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={styles.productImage}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className={styles.infoSection}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.artisan}>by {product.artisan}</p>
          <p className={styles.location}>📍 {product.location}</p>

          <div className={styles.ratingSection}>
            <span className={styles.rating}>★ {product.rating.toFixed(1)}</span>
            <span className={styles.reviews}>({product.reviews} reviews)</span>
          </div>

          <p className={styles.price}>
            {product.currency === "USD" ? "$" : product.currency}
            {product.price.toFixed(2)}
          </p>

          <div className={styles.descriptionSection}>
            <h3>Description</h3>
            <p className={styles.description}>{product.description}</p>
          </div>

          <button className={styles.addToCartBtn}>Add to Cart</button>
        </div>
      </div>

      <div className={styles.reviewsSection}>
        <h2>Customer Reviews</h2>

        <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
          <h3>Write a Review</h3>
          <div className={styles.formGroup}>
            <label>Name (optional)</label>
            <input
              type="text"
              value={review.reviewerName}
              onChange={(e) =>
                setReview({ ...review, reviewerName: e.target.value })
              }
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Rating</label>
            <select
              value={review.rating}
              onChange={(e) =>
                setReview({ ...review, rating: parseInt(e.target.value) })
              }
              className={styles.select}
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>
                  {num} Stars
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Your Review</label>
            <textarea
              value={review.comment}
              onChange={(e) =>
                setReview({ ...review, comment: e.target.value })
              }
              required
              rows={4}
              className={styles.textarea}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={styles.submitBtn}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        <div className={styles.reviewsList}>
          {product.reviewsList && product.reviewsList.length > 0 ? (
            product.reviewsList.map((rev) => (
              <div key={rev.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <strong>{rev.reviewerName || "Anonymous"}</strong>
                  <span className={styles.reviewRating}>★ {rev.rating}</span>
                </div>
                <p className={styles.reviewComment}>{rev.comment}</p>
                <small className={styles.reviewDate}>
                  {new Date(rev.createdAt).toLocaleDateString()}
                </small>
              </div>
            ))
          ) : (
            <p className={styles.noReviews}>
              No reviews yet. Be the first to review!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
