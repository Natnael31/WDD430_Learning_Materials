-- -- Create products table
-- CREATE TABLE IF NOT EXISTS products (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255) NOT NULL,
--   artisan VARCHAR(255) NOT NULL,
--   category VARCHAR(100) NOT NULL,
--   price DECIMAL(10, 2) NOT NULL,
--   currency VARCHAR(3) DEFAULT 'USD',
--   rating DECIMAL(3, 2) DEFAULT 0,
--   reviews INTEGER DEFAULT 0,
--   image TEXT NOT NULL,
--   is_featured BOOLEAN DEFAULT FALSE,
--   description TEXT NOT NULL,
--   location VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create reviews table
-- CREATE TABLE IF NOT EXISTS reviews (
--   id SERIAL PRIMARY KEY,
--   product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
--   rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
--   comment TEXT NOT NULL,
--   reviewer_name VARCHAR(255) DEFAULT 'Anonymous',
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create index for faster queries
-- CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
-- CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
-- CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

-- -- Create function to update product rating when review is added
-- CREATE OR REPLACE FUNCTION update_product_rating()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   UPDATE products
--   SET 
--     rating = (SELECT AVG(rating) FROM reviews WHERE product_id = NEW.product_id),
--     reviews = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id)
--   WHERE id = NEW.product_id;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Create trigger to automatically update rating when review is added
-- DROP TRIGGER IF EXISTS update_rating_trigger ON reviews;
-- CREATE TRIGGER update_rating_trigger
-- AFTER INSERT ON reviews
-- FOR EACH ROW
-- EXECUTE FUNCTION update_product_rating();


-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Create products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  artisan VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  image TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  reviewer_name VARCHAR(255) DEFAULT 'Anonymous',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);