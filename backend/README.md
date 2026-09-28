# Cholti Mart: Node.js Express Backend API (cPanel + MySQL)

A production-ready REST API built with Node.js, Express, and MySQL/MariaDB for **Cholti Mart Bangladesh**. Designed specifically for easy deployment on cPanel hosting (via cPanel "Setup Node.js App" / Passenger) or any VPS/Cloud Run container.

---

## 📁 Directory Structure

```
backend/
├── schema.sql             # Complete MySQL DDL schema + initial seed data
├── package.json           # Node.js dependencies and run scripts
├── .env.example           # Environment configuration template
├── README.md              # Deployment and API documentation
└── src/
    ├── server.js          # Express app entrypoint, CORS, and route mounting
    ├── config/
    │   └── db.js          # MySQL connection pool (mysql2/promise)
    ├── middleware/
    │   └── auth.js        # JWT verification and role checks (verifyToken, requireAdmin)
    └── routes/
        ├── auth.routes.js # Customer register/login, admin login, /me
        ├── product.routes.js # Public catalog, filters, pagination, admin CRUD
        └── order.routes.js   # Checkout transaction, order tracking, admin status
```

---

## 🚀 cPanel Deployment Guide (Step-by-Step)

### Step 1: Create the MySQL Database in cPanel
1. Log in to your **cPanel Dashboard**.
2. Navigate to **Databases** → **MySQL Databases**.
3. Create a new database: e.g., `youruser_choltimart`.
4. Create a new database user: e.g., `youruser_dbuser` with a strong password.
5. In **Add User To Database**, assign the user to the database and grant **ALL PRIVILEGES**.
6. Open **phpMyAdmin** from cPanel, select your database, click the **Import** tab, upload `backend/schema.sql`, and click **Go**.

> **Default Admin Account:**
> * **Username:** `admin`
> * **Password:** `admin123`
> *(Change this password immediately upon initial login)*

---

### Step 2: Upload Backend Files to cPanel
1. Open **cPanel File Manager**.
2. Create a folder in your home directory, e.g., `/home/youruser/api.choltimart.com` (or upload inside a subdomain folder).
3. Upload all files from the `backend/` folder.
4. Rename `.env.example` to `.env` and fill in your actual database credentials:
   ```env
   PORT=5000
   NODE_ENV=production
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=youruser_choltimart
   DB_USER=youruser_dbuser
   DB_PASSWORD=your_strong_mysql_password
   JWT_SECRET=your_super_secret_jwt_random_key_min_32_chars
   CLIENT_ORIGIN=https://choltimart.com,https://www.choltimart.com
   ```

---

### Step 3: Setup Node.js App in cPanel
1. In cPanel, search for **Setup Node.js App** (CloudLinux / Phusion Passenger).
2. Click **Create Application**:
   * **Node.js version:** Select `18.x` or `20.x` (recommended).
   * **Application mode:** `Production`.
   * **Application root:** `api.choltimart.com` (path where backend files are located).
   * **Application URL:** Select your subdomain (e.g. `api.choltimart.com`).
   * **Application startup file:** `src/server.js`.
3. Click **Create**.
4. In the app management screen, click **Run NPM Install** (or enter the cPanel terminal and run `npm install`).
5. Click **Restart Application**.
6. Test your live API by visiting `https://api.choltimart.com/api/health`. You should receive:
   ```json
   {
     "status": "healthy",
     "database": "connected",
     "environment": "production"
   }
   ```

---

## 🔌 API Endpoints Reference

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer (`name`, `phone`, `email`, `password`, `district`, `area`, `address`) |
| `POST` | `/api/auth/login` | Public | Customer login (`identifier` or `phone`, `password`). Returns JWT token. |
| `POST` | `/api/auth/admin/login` | Public | Administrative staff login (`username`, `password`). Returns admin JWT token. |
| `GET` | `/api/auth/me` | Logged In | Get current authenticated user profile (`Bearer <token>`). |

### 2. Products & Catalog (`/api/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | Fetch products with filters (`category`, `brand`, `search`, `minPrice`, `maxPrice`, `inStockOnly`, `isFeatured`, `isTrending`, `sortBy`, `page`, `limit`). |
| `GET` | `/api/products/:idOrSlug` | Public | Fetch single product detail by ID or URL slug. |
| `GET` | `/api/products/categories/all` | Public | Fetch active categories with product counts. |
| `POST` | `/api/products` | Admin | Create a new product. |
| `PUT` | `/api/products/:id` | Admin | Update product fields and inventory stock. |
| `DELETE` | `/api/products/:id` | Admin | Delete a product. |

### 3. Orders & Checkout (`/api/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Public/User | Place order with atomic transaction, stock decrement, and item validation. |
| `GET` | `/api/orders/track/:orderNumber` | Public | Track order status by order number and phone. |
| `GET` | `/api/orders/my-orders` | Customer | Fetch order history for authenticated customer. |
| `GET` | `/api/orders/admin/all` | Admin | View and filter all orders with pagination. |
| `GET` | `/api/orders/admin/:id` | Admin | View full order detail including items and customer info. |
| `PUT` | `/api/orders/admin/:id/status` | Admin | Update order status, courier tracking, and admin notes. |

---

## 🔗 Connecting Your React Frontend

In your React project root `.env`:
```env
VITE_API_BASE_URL=https://api.choltimart.com/api
VITE_USE_MOCK_DATA=false
```
When `VITE_USE_MOCK_DATA=false`, your React frontend services automatically direct requests to your live Express backend.
