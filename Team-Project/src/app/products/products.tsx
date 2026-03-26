"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Product } from "@/types";
import styles from "./products.module.css";

interface ProductsCarouselProps {
  featuredOnly?: boolean;
  title?: string;
}

export default function ProductsCarousel({
  featuredOnly = false,
  title = "Featured Products",
}: ProductsCarouselProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [featuredOnly]);

  const fetchProducts = async () => {
    try {
      // If featuredOnly is true, add the query parameter
      const url = featuredOnly
        ? "/api/products?featured=true"
        : "/api/products";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className={styles.loadingContainer}>Loading products...</div>;

  if (products.length === 0) {
    return (
      <section className={styles.productsContainer}>
        <div className={styles.productsWrapper}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <p className={styles.noProducts}>No products found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.productsContainer}>
      <div className={styles.productsWrapper}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.cardsGrid}>
          {products.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className={styles.cardLink}
            >
              <div className={styles.card}>
                <div className={styles.imageContainer}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className={styles.productImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.category}>{product.category}</span>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.artisan}>by {product.artisan}</p>
                  <p className={styles.location}>{product.location}</p>
                  <p className={styles.description}>{product.description}</p>
                  <div className={styles.footer}>
                    <div className={styles.ratingSection}>
                      <span className={styles.rating}>
                        ★ {product.rating.toFixed(1)}
                      </span>
                      <span className={styles.reviews}>
                        ({product.reviews})
                      </span>
                    </div>
                    <span className={styles.price}>
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
