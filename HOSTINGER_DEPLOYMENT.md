# Hostinger Business Deployment Notes

These settings are designed to keep the current app behavior intact while making deployment on
Hostinger Business safer.

## Recommended layout

- Frontend app: `moryaprintingpoint.com`
- Backend app: `api.moryaprintingpoint.com`
- Database: Hostinger MySQL

## Frontend app

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable:

```bash
VITE_API_BASE_URL=https://api.moryaprintingpoint.com
```

## Backend app

- Start command: `npm start`
- Entry file: `server/index.js`
- Environment variables:

```bash
PORT=4000
CLIENT_ORIGIN=https://moryaprintingpoint.com
DB_HOST=your-hostinger-db-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
DB_BOOTSTRAP_MODE=schema
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=replace-with-a-strong-password
JWT_SECRET=replace-with-a-long-random-secret-at-least-32-characters
UPLOADS_PUBLIC_BASE_URL=https://api.moryaprintingpoint.com
```

## Why these settings are low-risk

- `PORT` support lets Hostinger provide the runtime port without changing local development.
- `DB_BOOTSTRAP_MODE=schema` avoids relying on database-creation privileges in production.
- `UPLOADS_PUBLIC_BASE_URL` only changes generated upload URLs when you set it.
- Local development keeps the existing defaults if you do not change the environment.

## Still recommended later

- Move uploads to cloud storage for long-term reliability.
- Disable admin fallback content during final production smoke testing so API failures are obvious.
