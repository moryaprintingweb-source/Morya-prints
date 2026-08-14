# Morya Prints Backend Setup

This project now has an Express API, MySQL persistence, and an `/admin` panel.

## 1. Configure environment

Copy `.env.example` to `.env` and set your real MySQL credentials:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=morya_prints
```

Set a real admin login before sharing the site:

```bash
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=use-a-strong-password
JWT_SECRET=use-a-long-random-secret
```

## 2. Run locally

```bash
npm run server
npm run dev
```

Or run both:

```bash
npm run dev:full
```

Open:

- Website: `http://localhost:5173`
- Admin panel: `http://localhost:5173/admin`
- API health check: `http://localhost:4000/api/health`

## 3. Database

The API creates the database tables automatically on startup and seeds starter categories/products
when the catalog is empty. The SQL schema is also available at `database/schema.sql` if you prefer
manual setup.
