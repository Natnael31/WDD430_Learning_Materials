"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./addProduct.module.css";

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    artisan: "",
    category: "",
    price: "",
    currency: "USD",
    rating: "0",
    reviews: "0",
    image: "",
    isFeatured: false,
    description: "",
    location: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    "Textiles",
    "Pottery",
    "Stationery",
    "Jewelry",
    "Woodworking",
    "Metalwork",
    "Glassware",
    "Ceramics",
    "Leather",
    "Other",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    // Validate required fields
    if (
      !formData.name ||
      !formData.artisan ||
      !formData.category ||
      !formData.price ||
      !formData.image ||
      !formData.description ||
      !formData.location
    ) {
      setError("Please fill in all required fields");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create product");
      }

      const product = await response.json();
      setSuccess("Product created successfully!");

      // Reset form after 2 seconds and redirect
      setTimeout(() => {
        router.push(`/products`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Add New Product</h1>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Handwoven Cotton Scarf"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="artisan">Artisan Name *</label>
            <input
              type="text"
              id="artisan"
              name="artisan"
              value={formData.artisan}
              onChange={handleChange}
              required
              placeholder="e.g., Maria Lopez"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="price">Price *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                required
                placeholder="0.00"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD (C$)</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="rating">Initial Rating (0-5)</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="5"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reviews">Initial Review Count</label>
              <input
                type="number"
                id="reviews"
                name="reviews"
                value={formData.reviews}
                onChange={handleChange}
                min="0"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Image URL *</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="/products/your-image.jpg"
              required
              className={styles.input}
            />
            <small className={styles.helpText}>
              Place images in the public/products/ folder
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
              placeholder="Describe your product in detail..."
              className={styles.textarea}
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <label htmlFor="isFeatured">Feature this product on homepage</label>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={styles.submitBtn}
            >
              {submitting ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
