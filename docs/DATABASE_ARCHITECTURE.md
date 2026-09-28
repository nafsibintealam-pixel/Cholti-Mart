# Cholti Mart: Database Architecture Specification
**Database Engine**: MySQL 8.0+ / MariaDB 10.6+  
**Character Set / Collation**: `utf8mb4` / `utf8mb4_unicode_ci`  
**Storage Engine**: InnoDB  
**Document Status**: Phase 2A — Backend & Database Provisioning Preparation (Planning & Schema Definition Only)

---

## 1. Architectural Overview & Design Principles

The Cholti Mart database architecture is designed to support a hybrid deployment:
1. **High-Performance Headless E-Commerce**: Clean relational models designed for high-concurrency order placement, instant stock reservation, and rapid product discovery.
2. **WooCommerce / WordPress Synchronization**: Fully compatible with WooCommerce HPOS (High-Performance Order Storage) and WordPress taxonomy structures.
3. **Data Integrity & Consistency**: Enforced foreign key constraints, atomic transactions for inventory adjustments, strict ledger accounting for payments, and automated audit logging.

```
+--------------------------------------------------------------------------------------------------+
|                                    RELATIONAL ENTITY TOPOLOGY                                    |
+--------------------------------------------------------------------------------------------------+

  [ admin_users ] 1 ──── N [ admin_activity_logs ]
         │ 1
         │ N
     [ roles ] 1 ──── N [ role_permissions ] N ──── 1 [ permissions ]

  [ customers ] 1 ──── N [ customer_addresses ]
        │ 1
        │ N
     [ orders ] 1 ──── N [ order_items ] N ──── 1 [ products ]
        │ 1                                             │ 1
        ├── 1 ── [ payments ]                           ├── N ── [ product_images ]
        ├── 0..1 ── [ refunds ]                         ├── N ── [ product_variations ]
        ├── 0..1 ── [ coupons ]                         └── 1 ── [ inventory ] ── 1..N ── [ inventory_ledger ]
        └── N ── [ order_admin_notes ]

  [ categories ] 1 ──── N [ products ]
  [ brands ]     1 ──── N [ products ]
  [ delivery_zones ] 1 ──── N [ delivery_methods ]
```

---

## 2. Comprehensive Entity Definitions (29 Entities)

### 1. `AdminUser` (`admin_users`)
* **Purpose**: Manages administrative staff accounts, hashed credentials, and system access levels.
* **Fields**:
  * `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `uuid`: `CHAR(36) NOT NULL UNIQUE`
  * `name`: `VARCHAR(120) NOT NULL`
  * `username`: `VARCHAR(60) NOT NULL UNIQUE`
  * `email`: `VARCHAR(150) NOT NULL UNIQUE`
  * `phone`: `VARCHAR(30) NULL`
  * `password_hash`: `VARCHAR(255) NOT NULL` (Argon2id or bcrypt)
  * `role_id`: `INT UNSIGNED NOT NULL` (FK to `roles.id`)
  * `status`: `ENUM('active', 'inactive', 'suspended') DEFAULT 'active'`
  * `two_factor_enabled`: `TINYINT(1) DEFAULT 0`
  * `two_factor_secret`: `VARCHAR(255) NULL` (Encrypted)
  * `last_login_at`: `DATETIME NULL`
  * `last_login_ip`: `VARCHAR(45) NULL`
  * `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
  * `updated_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
* **Indexes**: `idx_admin_username (username)`, `idx_admin_email (email)`, `idx_admin_role (role_id)`.

### 2. `Role` (`roles`)
* **Purpose**: Granular RBAC definitions (`SUPER_ADMIN`, `ADMIN`, `MANAGER`, `ORDER_MANAGER`, `PRODUCT_MANAGER`, `SUPPORT_AGENT`).
* **Fields**:
  * `id`: `INT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `slug`: `VARCHAR(50) NOT NULL UNIQUE`
  * `title`: `VARCHAR(100) NOT NULL`
  * `wp_equivalent`: `VARCHAR(100) NULL`
  * `description`: `TEXT NULL`
  * `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

### 3. `Permission` (`permissions`) & `role_permissions`
* **Purpose**: Atomic capability grants (e.g. `manage_products`, `manage_orders`, `manage_delivery`).
* **Fields**:
  * `id`: `INT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `code`: `VARCHAR(80) NOT NULL UNIQUE`
  * `module`: `VARCHAR(50) NOT NULL`
  * `label`: `VARCHAR(100) NOT NULL`
  * `description`: `VARCHAR(255) NULL`
* **Join Table**: `role_permissions (role_id, permission_id, PRIMARY KEY (role_id, permission_id))`.

### 4. `Customer` (`customers`)
* **Purpose**: End-user profiles, historical purchase tracking, and contact details.
* **Fields**:
  * `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `uuid`: `CHAR(36) NOT NULL UNIQUE`
  * `name`: `VARCHAR(120) NOT NULL`
  * `phone`: `VARCHAR(25) NOT NULL UNIQUE`
  * `email`: `VARCHAR(150) NULL UNIQUE`
  * `password_hash`: `VARCHAR(255) NULL` (Null for guest checkout accounts)
  * `status`: `ENUM('active', 'blocked', 'lead') DEFAULT 'active'`
  * `total_spent`: `DECIMAL(12,2) DEFAULT 0.00`
  * `orders_count`: `INT UNSIGNED DEFAULT 0`
  * `wp_user_id`: `BIGINT UNSIGNED NULL`
  * `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
  * `updated_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
* **Indexes**: `idx_cust_phone (phone)`, `idx_cust_email (email)`.

### 5. `Address` (`customer_addresses`)
* **Purpose**: Structured shipping and billing addresses with Bangladesh district taxonomy.
* **Fields**:
  * `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `customer_id`: `BIGINT UNSIGNED NOT NULL` (FK to `customers.id` ON DELETE CASCADE)
  * `address_type`: `ENUM('shipping', 'billing') DEFAULT 'shipping'`
  * `recipient_name`: `VARCHAR(120) NOT NULL`
  * `recipient_phone`: `VARCHAR(25) NOT NULL`
  * `district`: `VARCHAR(80) NOT NULL` (e.g., 'Dhaka', 'Chattogram')
  * `area`: `VARCHAR(100) NOT NULL` (e.g., 'Dhanmondi', 'Gulshan')
  * `street_address`: `TEXT NOT NULL`
  * `postal_code`: `VARCHAR(20) NULL`
  * `is_default`: `TINYINT(1) DEFAULT 0`
  * `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
* **Indexes**: `idx_addr_customer (customer_id)`.

### 6. `Product` (`products`)
* **Purpose**: Core catalog items, pricing, SKU, status, and WooCommerce integration metadata.
* **Fields**:
  * `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `uuid`: `CHAR(36) NOT NULL UNIQUE`
  * `name`: `VARCHAR(255) NOT NULL`
  * `slug`: `VARCHAR(255) NOT NULL UNIQUE`
  * `sku`: `VARCHAR(100) NOT NULL UNIQUE`
  * `category_id`: `INT UNSIGNED NOT NULL` (FK to `categories.id`)
  * `brand_id`: `INT UNSIGNED NULL` (FK to `brands.id`)
  * `price`: `DECIMAL(10,2) NOT NULL`
  * `regular_price`: `DECIMAL(10,2) NULL`
  * `sale_price`: `DECIMAL(10,2) NULL`
  * `cost_price`: `DECIMAL(10,2) NULL`
  * `short_description`: `TEXT NULL`
  * `description`: `LONGTEXT NULL`
  * `in_stock`: `TINYINT(1) DEFAULT 1`
  * `stock_quantity`: `INT NOT NULL DEFAULT 0`
  * `low_stock_threshold`: `INT DEFAULT 5`
  * `status`: `ENUM('published', 'draft', 'archived', 'out_of_stock') DEFAULT 'published'`
  * `is_featured`: `TINYINT(1) DEFAULT 0`
  * `is_trending`: `TINYINT(1) DEFAULT 0`
  * `rating`: `DECIMAL(3,2) DEFAULT 0.00`
  * `reviews_count`: `INT UNSIGNED DEFAULT 0`
  * `warranty_info`: `VARCHAR(150) NULL`
  * `weight_kg`: `DECIMAL(6,3) NULL`
  * `wc_product_id`: `BIGINT UNSIGNED NULL UNIQUE`
  * `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
  * `updated_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
* **Indexes**: `idx_prod_slug (slug)`, `idx_prod_sku (sku)`, `idx_prod_category (category_id)`, `idx_prod_price (price)`, `idx_prod_featured (is_featured)`.

### 7. `ProductImage` (`product_images`)
* **Purpose**: Multi-image gallery assets and thumbnail mappings.
* **Fields**:
  * `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `product_id`: `BIGINT UNSIGNED NOT NULL` (FK to `products.id` ON DELETE CASCADE)
  * `image_url`: `TEXT NOT NULL`
  * `alt_text`: `VARCHAR(255) NULL`
  * `is_primary`: `TINYINT(1) DEFAULT 0`
  * `sort_order`: `INT DEFAULT 0`
  * `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
* **Indexes**: `idx_prod_img_fk (product_id)`.

### 8. `ProductVariation` (`product_variations`)
* **Purpose**: Size, color, and technical variants linked to parent product.
* **Fields**:
  * `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `product_id`: `BIGINT UNSIGNED NOT NULL` (FK to `products.id` ON DELETE CASCADE)
  * `sku`: `VARCHAR(100) NOT NULL UNIQUE`
  * `variant_name`: `VARCHAR(100) NOT NULL` (e.g. 'Midnight Black / 128GB')
  * `attributes`: `JSON NOT NULL` (e.g. `{"color": "Black", "size": "XL"}`)
  * `price_modifier`: `DECIMAL(10,2) DEFAULT 0.00`
  * `stock_quantity`: `INT NOT NULL DEFAULT 0`
  * `wc_variation_id`: `BIGINT UNSIGNED NULL`
* **Indexes**: `idx_variation_product (product_id)`.

### 9. `Inventory` (`inventory`)
* **Purpose**: Real-time snapshot of on-hand, reserved, and available stock units.
* **Fields**:
  * `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `product_id`: `BIGINT UNSIGNED NOT NULL UNIQUE` (FK to `products.id` ON DELETE CASCADE)
  * `on_hand_quantity`: `INT NOT NULL DEFAULT 0`
  * `reserved_quantity`: `INT NOT NULL DEFAULT 0` (In active checkouts/pending payment)
  * `available_quantity`: `INT GENERATED ALWAYS AS (on_hand_quantity - reserved_quantity) STORED`
  * `safety_stock`: `INT DEFAULT 2`
  * `last_counted_at`: `DATETIME NULL`
  * `updated_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`

### 10. `InventoryLedger` (`inventory_ledger`)
* **Purpose**: Double-entry audit trail recording every stock mutation (sale, restock, return, damage).
* **Fields**:
  * `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `product_id`: `BIGINT UNSIGNED NOT NULL` (FK to `products.id`)
  * `delta`: `INT NOT NULL` (e.g. +50, -2)
  * `balance_after`: `INT NOT NULL`
  * `reason`: `ENUM('sale', 'restock', 'return', 'damaged', 'audit_correction', 'manual') NOT NULL`
  * `reference_type`: `VARCHAR(50) NULL` (e.g. 'order', 'purchase_order', 'return_auth')
  * `reference_id`: `VARCHAR(100) NULL`
  * `note`: `TEXT NULL`
  * `created_by`: `BIGINT UNSIGNED NULL` (FK to `admin_users.id`)
  * `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
* **Indexes**: `idx_inv_product (product_id)`, `idx_inv_created (created_at)`.

### 11. `Category` (`categories`)
* **Purpose**: Product category taxonomy with parent-child nesting.
* **Fields**:
  * `id`: `INT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `name`: `VARCHAR(100) NOT NULL`
  * `bangla_name`: `VARCHAR(150) NULL`
  * `slug`: `VARCHAR(120) NOT NULL UNIQUE`
  * `parent_id`: `INT UNSIGNED NULL` (FK to `categories.id` ON DELETE SET NULL)
  * `description`: `TEXT NULL`
  * `icon_name`: `VARCHAR(50) NULL`
  * `image_url`: `TEXT NULL`
  * `item_count`: `INT UNSIGNED DEFAULT 0`
  * `sort_order`: `INT DEFAULT 0`
  * `wc_category_id`: `BIGINT UNSIGNED NULL UNIQUE`
* **Indexes**: `idx_cat_slug (slug)`, `idx_cat_parent (parent_id)`.

### 12. `Brand` (`brands`)
* **Purpose**: Manufacturer & brand catalog metadata.
* **Fields**:
  * `id`: `INT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `name`: `VARCHAR(100) NOT NULL`
  * `slug`: `VARCHAR(120) NOT NULL UNIQUE`
  * `logo_url`: `TEXT NULL`
  * `description`: `TEXT NULL`
  * `origin_country`: `VARCHAR(80) NULL`
  * `website`: `VARCHAR(255) NULL`
  * `is_featured`: `TINYINT(1) DEFAULT 0`
  * `product_count`: `INT UNSIGNED DEFAULT 0`

### 13. `Order` (`orders`)
* **Purpose**: Master order record handling lifecycle from checkout to courier delivery.
* **Fields**:
  * `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `order_number`: `VARCHAR(50) NOT NULL UNIQUE` (e.g. 'CM-2609-1082')
  * `customer_id`: `BIGINT UNSIGNED NULL` (FK to `customers.id` ON DELETE SET NULL)
  * `customer_name`: `VARCHAR(120) NOT NULL`
  * `phone`: `VARCHAR(25) NOT NULL`
  * `email`: `VARCHAR(150) NULL`
  * `district`: `VARCHAR(80) NOT NULL`
  * `area`: `VARCHAR(100) NOT NULL`
  * `address`: `TEXT NOT NULL`
  * `subtotal`: `DECIMAL(10,2) NOT NULL`
  * `delivery_fee`: `DECIMAL(8,2) NOT NULL`
  * `discount`: `DECIMAL(8,2) DEFAULT 0.00`
  * `coupon_code`: `VARCHAR(50) NULL`
  * `total`: `DECIMAL(10,2) NOT NULL`
  * `status`: `ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned') DEFAULT 'pending'`
  * `delivery_status`: `ENUM('pending', 'assigned', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned') DEFAULT 'pending'`
  * `payment_status`: `ENUM('pending', 'paid', 'partially_paid', 'refunded', 'failed') DEFAULT 'pending'`
  * `payment_method`: `ENUM('cod', 'bkash', 'nagad', 'card') NOT NULL`
  * `courier_partner`: `VARCHAR(50) NULL` (e.g. 'steadfast', 'pathao', 'redx')
  * `courier_tracking_code`: `VARCHAR(100) NULL`
  * `customer_notes`: `TEXT NULL`
  * `wc_order_id`: `BIGINT UNSIGNED NULL UNIQUE`
  * `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
  * `updated_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
* **Indexes**: `idx_order_num (order_number)`, `idx_order_phone (phone)`, `idx_order_status (status)`, `idx_order_created (created_at)`.

### 14. `OrderItem` (`order_items`)
* **Purpose**: Line item records preserving historic prices and product snapshots at time of purchase.
* **Fields**:
  * `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `order_id`: `BIGINT UNSIGNED NOT NULL` (FK to `orders.id` ON DELETE CASCADE)
  * `product_id`: `BIGINT UNSIGNED NOT NULL` (FK to `products.id`)
  * `product_name`: `VARCHAR(255) NOT NULL`
  * `sku`: `VARCHAR(100) NOT NULL`
  * `unit_price`: `DECIMAL(10,2) NOT NULL`
  * `quantity`: `INT NOT NULL`
  * `subtotal`: `DECIMAL(10,2) NOT NULL`
  * `selected_color`: `VARCHAR(50) NULL`
  * `selected_size`: `VARCHAR(50) NULL`
* **Indexes**: `idx_item_order (order_id)`, `idx_item_product (product_id)`.

### 15. `Coupon` (`coupons`)
* **Purpose**: Promotional discount codes and validation rules.
* **Fields**:
  * `id`: `INT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `code`: `VARCHAR(50) NOT NULL UNIQUE`
  * `discount_type`: `ENUM('percentage', 'fixed') NOT NULL`
  * `discount_amount`: `DECIMAL(10,2) NOT NULL`
  * `min_spend`: `DECIMAL(10,2) DEFAULT 0.00`
  * `max_spend`: `DECIMAL(10,2) NULL`
  * `usage_limit`: `INT UNSIGNED NULL`
  * `usage_count`: `INT UNSIGNED DEFAULT 0`
  * `expiry_date`: `DATETIME NULL`
  * `is_active`: `TINYINT(1) DEFAULT 1`
  * `description`: `VARCHAR(255) NULL`
  * `wc_coupon_id`: `BIGINT UNSIGNED NULL`

### 16. `CouponUsage` (`coupon_usages`)
* **Purpose**: Tracks single-use rules per customer or order.
* **Fields**:
  * `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `coupon_id`: `INT UNSIGNED NOT NULL` (FK to `coupons.id`)
  * `order_id`: `BIGINT UNSIGNED NOT NULL` (FK to `orders.id`)
  * `customer_phone`: `VARCHAR(25) NOT NULL`
  * `discount_applied`: `DECIMAL(10,2) NOT NULL`
  * `used_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

### 17. `DeliveryZone` (`delivery_zones`)
* **Purpose**: Regional logistics boundaries, delivery charges, and SLAs.
* **Fields**:
  * `id`: `INT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `name`: `VARCHAR(100) NOT NULL` (e.g. 'Inside Dhaka', 'Dhaka Suburbs', 'Nationwide Bangladesh')
  * `districts`: `JSON NOT NULL` (Array of BD districts mapped to this zone)
  * `base_charge`: `DECIMAL(8,2) NOT NULL`
  * `estimated_hours`: `VARCHAR(50) NOT NULL` (e.g. '24-48 Hours')
  * `is_cod_supported`: `TINYINT(1) DEFAULT 1`
  * `is_active`: `TINYINT(1) DEFAULT 1`

### 18. `Courier` (`couriers`)
* **Purpose**: Courier gateway configuration and consignment dispatch rules.
* **Fields**:
  * `id`: `INT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `slug`: `VARCHAR(50) NOT NULL UNIQUE` (e.g. 'steadfast', 'pathao', 'redx')
  * `name`: `VARCHAR(100) NOT NULL`
  * `is_active`: `TINYINT(1) DEFAULT 0`
  * `auto_sync_enabled`: `TINYINT(1) DEFAULT 0`
  * `webhook_url`: `TEXT NULL`
  * `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

### 19. `Payment` (`payments`)
* **Purpose**: Financial ledger records for transactions across bKash, Nagad, SSLCommerz, and COD.
* **Fields**:
  * `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `order_id`: `BIGINT UNSIGNED NOT NULL` (FK to `orders.id`)
  * `transaction_ref`: `VARCHAR(100) NOT NULL UNIQUE`
  * `gateway`: `ENUM('cod', 'bkash', 'nagad', 'sslcommerz') NOT NULL`
  * `amount`: `DECIMAL(10,2) NOT NULL`
  * `currency`: `VARCHAR(10) DEFAULT 'BDT'`
  * `status`: `ENUM('initiated', 'successful', 'failed', 'refunded') DEFAULT 'initiated'`
  * `gateway_response`: `JSON NULL`
  * `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
* **Indexes**: `idx_pay_order (order_id)`, `idx_pay_tx (transaction_ref)`.

### 20. `Refund` (`refunds`)
* **Purpose**: Return authorizations and financial disbursements.
* **Fields**:
  * `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `order_id`: `BIGINT UNSIGNED NOT NULL` (FK to `orders.id`)
  * `payment_id`: `BIGINT UNSIGNED NULL` (FK to `payments.id`)
  * `amount`: `DECIMAL(10,2) NOT NULL`
  * `reason`: `TEXT NOT NULL`
  * `status`: `ENUM('requested', 'approved', 'processed', 'rejected') DEFAULT 'requested'`
  * `processed_by`: `BIGINT UNSIGNED NULL` (FK to `admin_users.id`)
  * `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

### 21. `Review` (`product_reviews`)
* **Purpose**: Customer ratings, text reviews, and verified purchase markers.
* **Fields**:
  * `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `product_id`: `BIGINT UNSIGNED NOT NULL` (FK to `products.id` ON DELETE CASCADE)
  * `customer_name`: `VARCHAR(100) NOT NULL`
  * `rating`: `TINYINT UNSIGNED NOT NULL` (1 to 5)
  * `comment`: `TEXT NOT NULL`
  * `is_verified_purchase`: `TINYINT(1) DEFAULT 0`
  * `status`: `ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'`
  * `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

### 22. `SiteSettings` (`site_settings`)
* **Purpose**: Key-value JSON store for global store identity, phone, currency, and thresholds.
* **Fields**:
  * `setting_key`: `VARCHAR(100) PRIMARY KEY`
  * `setting_value`: `JSON NOT NULL`
  * `updated_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`

### 23. `HomepageSection` (`homepage_sections`)
* **Purpose**: Dynamic homepage ordering and visibility flags.
* **Fields**:
  * `id`: `VARCHAR(50) PRIMARY KEY`
  * `title`: `VARCHAR(150) NOT NULL`
  * `is_enabled`: `TINYINT(1) DEFAULT 1`
  * `sort_order`: `INT NOT NULL DEFAULT 0`
  * `settings_payload`: `JSON NULL`

### 24. `Banner` (`marketing_banners`)
* **Purpose**: Promotional graphics and countdown headers.
* **Fields**:
  * `id`: `INT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `title`: `VARCHAR(150) NOT NULL`
  * `image_url`: `TEXT NOT NULL`
  * `target_url`: `VARCHAR(255) NULL`
  * `position`: `ENUM('hero', 'middle', 'footer', 'popup') DEFAULT 'middle'`
  * `is_active`: `TINYINT(1) DEFAULT 1`
  * `start_date`: `DATETIME NULL`
  * `end_date`: `DATETIME NULL`

### 25. `FAQ` (`faqs`)
* **Purpose**: Storewide helpdesk and customer support queries.
* **Fields**:
  * `id`: `INT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `question`: `VARCHAR(255) NOT NULL`
  * `answer`: `TEXT NOT NULL`
  * `category`: `VARCHAR(80) DEFAULT 'General'`
  * `sort_order`: `INT DEFAULT 0`
  * `is_active`: `TINYINT(1) DEFAULT 1`

### 26. `Page` (`cms_pages`)
* **Purpose**: Content pages (Privacy Policy, Terms of Service, Return Policy).
* **Fields**:
  * `id`: `INT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `title`: `VARCHAR(200) NOT NULL`
  * `slug`: `VARCHAR(150) NOT NULL UNIQUE`
  * `content`: `LONGTEXT NOT NULL`
  * `status`: `ENUM('published', 'draft') DEFAULT 'published'`
  * `seo_title`: `VARCHAR(200) NULL`
  * `seo_description`: `TEXT NULL`
  * `updated_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`

### 27. `Media` (`media_items`)
* **Purpose**: Uploaded image and asset registry.
* **Fields**:
  * `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `file_name`: `VARCHAR(255) NOT NULL`
  * `file_url`: `TEXT NOT NULL`
  * `file_type`: `VARCHAR(50) NOT NULL`
  * `file_size_bytes`: `BIGINT UNSIGNED NOT NULL`
  * `alt_text`: `VARCHAR(255) NULL`
  * `uploaded_by`: `BIGINT UNSIGNED NULL` (FK to `admin_users.id`)
  * `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

### 28. `AuditLog` (`admin_activity_logs`)
* **Purpose**: Immutable security audit trail recording every administrative modification.
* **Fields**:
  * `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `user_id`: `BIGINT UNSIGNED NULL` (FK to `admin_users.id` ON DELETE SET NULL)
  * `username`: `VARCHAR(60) NOT NULL`
  * `role`: `VARCHAR(50) NOT NULL`
  * `action`: `VARCHAR(100) NOT NULL`
  * `category`: `ENUM('auth', 'catalog', 'orders', 'inventory', 'customers', 'system', 'security') NOT NULL`
  * `details`: `TEXT NOT NULL`
  * `ip_address`: `VARCHAR(45) NOT NULL`
  * `user_agent`: `VARCHAR(255) NULL`
  * `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
* **Indexes**: `idx_audit_user (user_id)`, `idx_audit_category (category)`, `idx_audit_time (created_at)`.

### 29. `Notification` (`admin_notifications`)
* **Purpose**: In-app operational alerts (new orders, stock-out warnings, customer escalations).
* **Fields**:
  * `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
  * `title`: `VARCHAR(150) NOT NULL`
  * `message`: `TEXT NOT NULL`
  * `type`: `ENUM('order', 'stock', 'customer', 'security', 'system') NOT NULL`
  * `link`: `VARCHAR(255) NULL`
  * `is_read`: `TINYINT(1) DEFAULT 0`
  * `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
