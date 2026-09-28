-- ==============================================================================
-- CHOLTI MART E-COMMERCE: PRODUCTION MYSQL DATABASE SCHEMA
-- Compatible with MySQL 8.0+ / MariaDB 10.6+ on cPanel / Cloud Hosting
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS admin_users;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- 1. ADMIN USERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE admin_users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(60) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPPORT') DEFAULT 'ADMIN',
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_admin_username (username),
  INDEX idx_admin_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. CUSTOMERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE customers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(25) NOT NULL UNIQUE,
  email VARCHAR(150) NULL UNIQUE,
  password_hash VARCHAR(255) NULL, -- NULL allows guest checkout records
  district VARCHAR(60) NULL,
  area VARCHAR(100) NULL,
  address TEXT NULL,
  status ENUM('active', 'blocked') DEFAULT 'active',
  orders_count INT UNSIGNED DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_cust_phone (phone),
  INDEX idx_cust_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description TEXT NULL,
  image_url VARCHAR(255) NULL,
  parent_id INT UNSIGNED NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_category_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. BRANDS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE brands (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  logo_url VARCHAR(255) NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_brand_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE products (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  sku VARCHAR(60) NOT NULL UNIQUE,
  description LONGTEXT NULL,
  short_description TEXT NULL,
  price DECIMAL(10,2) NOT NULL,
  regular_price DECIMAL(10,2) NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  stock_status ENUM('in_stock', 'low_stock', 'out_of_stock') DEFAULT 'in_stock',
  category_id INT UNSIGNED NULL,
  brand_id INT UNSIGNED NULL,
  image_url TEXT NULL, -- Primary thumbnail image
  gallery JSON NULL, -- JSON array of additional image URLs
  unit VARCHAR(30) DEFAULT 'piece',
  weight VARCHAR(30) NULL,
  is_featured TINYINT(1) DEFAULT 0,
  is_trending TINYINT(1) DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 5.00,
  reviews_count INT UNSIGNED DEFAULT 0,
  status ENUM('published', 'draft', 'archived') DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
  INDEX idx_prod_slug (slug),
  INDEX idx_prod_sku (sku),
  INDEX idx_prod_cat (category_id),
  INDEX idx_prod_status (status),
  INDEX idx_prod_featured (is_featured),
  FULLTEXT idx_prod_search (name, description, sku)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. ORDERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(40) NOT NULL UNIQUE,
  customer_id BIGINT UNSIGNED NULL,
  customer_name VARCHAR(120) NOT NULL,
  phone VARCHAR(25) NOT NULL,
  email VARCHAR(150) NULL,
  district VARCHAR(60) NOT NULL,
  area VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  customer_notes TEXT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  coupon_code VARCHAR(50) NULL,
  total DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL DEFAULT 'Cash on Delivery',
  payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
  payment_transaction_id VARCHAR(100) NULL,
  status ENUM('Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
  delivery_status ENUM('pending', 'processing', 'in_transit', 'delivered', 'cancelled') DEFAULT 'pending',
  courier_partner VARCHAR(60) NULL,
  tracking_number VARCHAR(100) NULL,
  admin_note TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  INDEX idx_order_number (order_number),
  INDEX idx_order_phone (phone),
  INDEX idx_order_customer (customer_id),
  INDEX idx_order_status (status),
  INDEX idx_order_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. ORDER ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NULL,
  product_name VARCHAR(255) NOT NULL,
  sku VARCHAR(60) NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(255) NULL,
  variant VARCHAR(100) NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  INDEX idx_item_order (order_id),
  INDEX idx_item_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Super Admin User (Password: admin123 | bcrypt hashed with 10 salt rounds)
INSERT INTO admin_users (name, username, email, password_hash, role, status) VALUES 
('Cholti Mart Admin', 'admin', 'admin@choltimart.com', '$2a$10$iMh.O/LzQ15.34q8w3d38eYgE2rW6zU07.8qYkK1bOQ2Z91mK2F1K', 'SUPER_ADMIN', 'active')
ON DUPLICATE KEY UPDATE id=id;

-- Sample Categories
INSERT INTO categories (name, slug, description, display_order) VALUES
('Groceries & Staples', 'groceries', 'Fresh rice, oils, spices, and daily essentials', 1),
('Beverages', 'beverages', 'Tea, coffee, natural juices, and soft drinks', 2),
('Personal Care', 'personal-care', 'Soaps, haircare, skincare, and hygiene products', 3),
('Snacks & Packaged Foods', 'snacks', 'Biscuits, noodles, chocolates, and savory snacks', 4),
('Home & Cleaning', 'home-cleaning', 'Detergents, floor cleaners, and kitchen supplies', 5)
ON DUPLICATE KEY UPDATE id=id;

-- Sample Brands
INSERT INTO brands (name, slug) VALUES
('Pran', 'pran'),
('Square Consumer', 'square-consumer'),
('Unilever', 'unilever'),
('ACI Pure', 'aci-pure'),
('Teer', 'teer')
ON DUPLICATE KEY UPDATE id=id;

-- Sample Products
INSERT INTO products (name, slug, sku, description, short_description, price, regular_price, stock_quantity, stock_status, category_id, brand_id, image_url, unit, is_featured, is_trending) VALUES
('Teer Fortified Soyabean Oil 5L', 'teer-fortified-soyabean-oil-5l', 'OIL-TEER-5L', 'Premium quality 100% pure fortified soyabean oil with Vitamin A & D.', '100% pure soyabean oil 5 Litre jar.', 890.00, 930.00, 45, 'in_stock', 1, 5, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80', '5L Jar', 1, 1),
('ACI Pure Miniket Rice 5kg', 'aci-pure-miniket-rice-5kg', 'RICE-ACI-MINIKET-5K', 'Selected high quality long grain Miniket rice, triple sorted and stone-free.', 'High quality ACI Pure Miniket rice 5kg pack.', 385.00, 410.00, 80, 'in_stock', 1, 4, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80', '5kg Pack', 1, 0),
('Pran Mango Juice 1L', 'pran-mango-juice-1l', 'JUC-PRAN-MANGO-1L', 'Delicious and refreshing real mango drink from sweet Rajshahi mangoes.', 'Natural mango fruit drink 1 Litre bottle.', 120.00, 130.00, 120, 'in_stock', 2, 1, 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&q=80', '1L Bottle', 0, 1),
('Radhuni Turmeric Powder 200g', 'radhuni-turmeric-powder-200g', 'SPICE-RADHUNI-TUR-200G', 'Pure and fresh sun-dried turmeric powder for authentic color and aroma.', 'Natural turmeric powder 200g packet.', 85.00, 95.00, 60, 'in_stock', 1, 2, 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80', '200g Pack', 1, 0),
('Lifebuoy Total 10 Handwash 200ml Refill', 'lifebuoy-total-10-handwash-200ml', 'HW-LIFEBUOY-TOT-200ML', 'Advanced formula protecting against 99.9% illness-causing germs in 10 seconds.', 'Germ protection handwash 200ml pouch.', 75.00, 80.00, 150, 'in_stock', 3, 3, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80', '200ml Pouch', 0, 0)
ON DUPLICATE KEY UPDATE id=id;
