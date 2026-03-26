export interface Product {
  id: number;
  name: string;
  artisan: string;
  category: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  image: string;
  isFeatured: boolean; // camelCase for frontend
  description: string;
  location: string;
  createdAt?: Date;
  updatedAt?: Date;
  reviewsList?: Review[];
}

export interface Review {
  id: number;
  productId: number; // camelCase for frontend
  rating: number;
  comment: string;
  reviewerName: string; // camelCase for frontend
  createdAt: Date;
}

export interface ProductFormData {
  name: string;
  artisan: string;
  category: string;
  price: string;
  currency: string;
  rating: string;
  reviews: string;
  image: string;
  isFeatured: boolean; // camelCase
  description: string;
  location: string;
}
