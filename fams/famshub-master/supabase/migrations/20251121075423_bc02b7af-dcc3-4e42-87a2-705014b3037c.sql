-- Add featured column to products table
ALTER TABLE products ADD COLUMN featured boolean DEFAULT false;

-- Create index for faster featured product queries
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;