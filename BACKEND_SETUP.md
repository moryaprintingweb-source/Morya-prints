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

For split frontend/backend deployments, also set:

```bash
VITE_API_BASE_URL=https://api.your-domain.com
CLIENT_ORIGIN=https://your-domain.com
```

If your production MySQL user cannot create databases, set:

```bash
DB_BOOTSTRAP_MODE=schema
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

On managed hosting, `DB_BOOTSTRAP_MODE=schema` is usually safer after the database itself has been
created in the hosting panel.

## 4. Uploads

By default, uploads are stored locally and returned as `/uploads/...`.

If your frontend and backend run on different domains or subdomains, set:

```bash
UPLOADS_PUBLIC_BASE_URL=https://api.your-domain.com
```

That keeps uploaded file URLs pointing at the API host instead of the frontend host.
