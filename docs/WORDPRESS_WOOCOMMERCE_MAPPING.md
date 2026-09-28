# Cholti Mart: WordPress & WooCommerce Architecture Mapping
**Document Status**: Phase 2A — Backend & Database Provisioning Preparation (Architecture Mapping Only)

---

## 1. Architectural System Partitioning

This document formalizes the division of responsibilities across the application ecosystem. Every domain entity and operational capability has a single definitive home:

```
+─────────────────────────────────────────────────────────────────────────────────────────+
|                                  SYSTEM ARCHITECTURE                                     |
+─────────────────────────────────────────────────────────────────────────────────────────+

  [ FRONTEND CLIENT (React/Vite SPA) ]
      │ (Public API calls / Safe state)
      ▼
  [ SECURE API GATEWAY (Node.js / Express Proxy / WP REST) ]
      ├── (A) WooCommerce REST API ──► E-Commerce Entities (Products, Orders, Customers)
      ├── (B) WordPress Core API   ──► CMS & Content (Pages, Media, FAQs, SEO)
      └── (C) Custom Backend / DB  ──► BD Couriers, Webhook Ledgers, Audit Logs, Vault
```

---

## 2. Definitive Domain Mapping Matrix

| Domain / Entity | Architecture Home | Primary Storage Location / Table | API Pathway | Integration Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Products** | **WooCommerce** | `wp_posts` (`post_type='product'`), `wp_postmeta`, `wp_wc_product_meta_lookup` | `/wp-json/wc/v3/products` | Core catalog synced via standard WC v3 endpoints with full payload mapper |
| **Product Variations** | **WooCommerce** | `wp_posts` (`post_type='product_variation'`), `wp_postmeta` | `/wp-json/wc/v3/products/<id>/variations` | Variations represent colors, sizes, and specs |
| **Categories** | **WooCommerce** | `wp_terms`, `wp_term_taxonomy` (`taxonomy='product_cat'`) | `/wp-json/wc/v3/products/categories` | Hierarchical taxonomy with thumbnail asset bindings |
| **Inventory / Stock** | **WooCommerce** | `wp_postmeta` (`_stock`, `_stock_status`, `_manage_stock`) | `/wp-json/wc/v3/products/<id>` | Stock level decremented on order creation; synchronized with custom ledger |
| **Orders** | **WooCommerce** | WooCommerce HPOS tables (`wp_wc_orders`, `wp_wc_order_addresses`, `wp_wc_order_operational_data`) | `/wp-json/wc/v3/orders` | HPOS provides relational speed; status synchronized across lifecycle |
| **Order Items** | **WooCommerce** | `wp_wc_order_items`, `wp_wc_order_itemmeta` | `/wp-json/wc/v3/orders/<id>` | Preserves price snapshot and variation metadata |
| **Customers** | **WooCommerce** | `wp_users`, `wp_usermeta`, `wp_wc_customer_lookup` | `/wp-json/wc/v3/customers` | Customer lookup table handles order frequency, total spend, and phone records |
| **Coupons** | **WooCommerce** | `wp_posts` (`post_type='shop_coupon'`), `wp_postmeta` | `/wp-json/wc/v3/coupons` | Percentage and fixed cart discount validation |
| **Pages** | **WordPress / CMS** | `wp_posts` (`post_type='page'`) | `/wp-json/wp/v2/pages` | Privacy Policy, Terms of Service, Return Policy, and About Us |
| **Media Assets** | **WordPress / CMS** | `wp_posts` (`post_type='attachment'`), `/wp-content/uploads/` | `/wp-json/wp/v2/media` | Native media library with automated responsive thumbnails |
| **Homepage Sections** | **WordPress / CMS** | `wp_options` or ACF Options Page | `/wp-json/wp/v2/settings` or `/wp-json/cholti/v1/homepage` | JSON block schema managing section ordering and toggle states |
| **FAQs** | **WordPress / CMS** | Custom Post Type (`cpt_faq`) or ACF repeater | `/wp-json/wp/v2/faq` | Categorized Q&A list for customer support |
| **Testimonials** | **WordPress / CMS** | Custom Post Type (`cpt_testimonial`) or ACF | `/wp-json/wp/v2/testimonial` | Verified buyer quotes with star ratings |
| **Site Settings** | **WordPress / CMS** | `wp_options` (Blog name, contact phone, store address) | `/wp-json/wp/v2/settings` | Global store settings and operational thresholds |
| **SEO Metadata** | **WordPress / CMS** | Yoast SEO / RankMath postmeta fields | `/wp-json/wp/v2/pages` / Yoast REST API | Title tags, meta descriptions, OpenGraph, Schema.org |
| **Admin Roles & RBAC**| **Custom Backend / DB** | `roles`, `permissions`, `role_permissions` | `/api/v1/admin/roles` | Granular capability enforcement decoupled from generic WP user roles |
| **Audit Logs** | **Custom Backend / DB** | `admin_activity_logs` | `/api/v1/audit-logs` | Immutable audit trail of catalog changes, orders, and logins |
| **BD Courier Config** | **Custom Backend / DB** | `couriers`, encrypted vault storage | Server-side only | API keys for Steadfast, Pathao, RedX; NEVER exposed to frontend |
| **Courier Assignments**| **Custom Backend / DB** | `orders.courier_partner`, consignment ledger | `/api/v1/delivery/orders/:id/assign` | Dispatches consignment to courier webhook and returns tracking number |
| **Inventory Audit Ledger**| **Custom Backend / DB** | `inventory_ledger` | `/api/v1/inventory/:id/history` | Double-entry stock tracking with author ID, reason, and delta |
| **Payment Webhook Ledger**| **Custom Backend / DB** | `payments`, `payment_webhooks` | `/api/v1/payments/webhook/:gateway` | Stores raw IPN payloads from bKash, Nagad, SSLCommerz for audit and reconciliation |
| **Integration Config** | **Custom Backend / DB** | `integrations` | `/api/v1/integrations` | Tracks connection health, webhook endpoints, and sync statuses |
| **Security Events** | **Custom Backend / DB** | `security_events`, `login_history` | `/api/v1/admin/security` | IP tracking, failed attempts, and active session tokens |
| **Language Preference**| **Frontend Only** | Browser `localStorage('cholti_lang')` | None (Client-side) | Instant language switching (`en` / `bn`) without network overhead |
| **Guest Cart Cache** | **Frontend Only** | Browser `localStorage('cholti_cart')` | None (Client-side) | Instant cart drawer updates; synchronized to WC cart upon customer login |
| **Guest Wishlist Cache**| **Frontend Only** | Browser `localStorage('cholti_wishlist')` | None (Client-side) | Local array of saved product IDs |
| **Temporary UI State** | **Frontend Only** | React State / Context | None (Client-side) | Active filters, modal open states, customizer live previews |

---

## 3. Authentication & Authorization Architecture

```
                                  AUTHENTICATION FLOW
                                  ═══════════════════

  [ Admin / Customer Login Form ]
                │
                │ HTTPS POST: { username, password }
                ▼
  [ Secure Server Auth Gateway ]
                │
                ├── 1. Check Rate Limiting & Brute Force Lockout
                ├── 2. Query admin_users / wp_users
                ├── 3. Verify Argon2id / bcrypt Password Hash
                ├── 4. Evaluate Server-Enforced RBAC Permissions
                │
                ▼
  [ Issue Signed Tokens ]
       ├── Access Token: Short-lived JWT (e.g. 15-minute expiry)
       └── Refresh Token: HttpOnly Secure SameSite Cookie (e.g. 7-day expiry)
```

1. **Server-Side Enforcement**: All authentication decisions, permission checks, and password verifications are executed exclusively on the server.
2. **Zero Client-Side Secrets**: The frontend receives only an ephemeral access token and user metadata (ID, name, role, permissions list).
3. **WordPress Bridge**: When operating alongside WordPress, authentication is handled via WordPress Application Passwords or JWT Authentication for WP REST API, proxied by the backend server to ensure credentials never hit client storage.
