"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./manageProducts.module.css";

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
}

export default function ManageProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      artisan: product.artisan,
      category: product.category,
      price: product.price.toString(),
      currency: product.currency,
      rating: product.rating.toString(),
      reviews: product.reviews.toString(),
      image: product.image,
      isFeatured: product.isFeatured,
      description: product.description,
      location: product.location,
    });
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/products/${selectedProduct?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update product");

      setSuccess("Product updated successfully!");
      setTimeout(() => {
        setIsEditing(false);
        setSelectedProduct(null);
        fetchProducts();
      }, 1500);
    } catch (err) {
      setError("Failed to update product");
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    setIsDeleting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      setSuccess("Product deleted successfully!");
      setTimeout(() => {
        fetchProducts();
      }, 1000);
    } catch (err) {
      setError("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

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

  if (loading) {
    return <div className={styles.loading}>Loading products...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Products</h1>
        <button
          onClick={() => router.push("/admin/addProduct")}
          className={styles.addButton}
        >
          + Add New Product
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {/* Edit Modal */}
      {isEditing && selectedProduct && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Edit Product</h2>
              <button
                onClick={() => setIsEditing(false)}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdate} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Artisan Name *</label>
                <input
                  type="text"
                  name="artisan"
                  value={formData.artisan}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className={styles.select}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    required
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Image URL *</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  className={styles.textarea}
                />
              </div>

              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                <label>Feature this product on homepage</label>
              </div>

              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.updateBtn}>
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Artisan</th>
              <th>Category</th>
              <th>Price</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <div className={styles.tableImage}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={50}
                      height={50}
                      className={styles.productImage}
                    />
                  </div>
                </td>
                <td className={styles.productName}>{product.name}</td>
                <td>{product.artisan}</td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.isFeatured ? "✓" : "✗"}</td>
                <td>
                  <button
                    onClick={() => handleEdit(product)}
                    className={styles.editBtn}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    disabled={isDeleting}
                    className={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
