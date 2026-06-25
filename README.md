# ENUGU — Premium Streetwear E-Commerce

> **Made to Stand Out**

ENUGU is a full-stack e-commerce platform for a premium streetwear brand. It ships with a customer-facing storefront, a complete admin/super-admin panel, coupons & campaigns, a custom-design request workflow, wishlist, stock-notification, and SEO tooling — backed by a secure, transactional Node/Express + MongoDB API.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [NPM Scripts](#npm-scripts)
- [Testing](#testing)
- [API Overview](#api-overview)
- [Default Credentials](#default-credentials)
- [Deployment](#deployment)
- [Security Notes](#security-notes)
- [Documentation](#documentation)
- [License](#license)

---

## Features

### Storefront (customer)
- Home, shop, product detail (PDP), collections, about, contact, custom-design pages
- Cart, coupon application, **COD checkout** (Razorpay payment hook is stubbed for later)
- Wishlist, order history, address book, profile management
- **Back-in-stock notifications** and contact form
- SEO: server-generated sitemap, meta tags, legal pages

### Admin & Super Admin
- Dashboard with analytics (revenue, orders, top products via Recharts)
- Product, size-guide, order, customer, coupon, and campaign management
- Custom-design request management
- Activity logs / audit trail
- Role-based access (customer / admin / super-admin) with granular permissions

### Platform & correctness
- **Transactional checkout** — stock decrement, order creation, and coupon usage commit atomically (MongoDB transactions), so concurrent orders **cannot oversell**
- **Inventory restoration** on order cancel/return
- **Email** via Nodemailer: email verification, password reset, order confirmation, back-in-stock (logs to console in dev when SMTP is unset)
- **Email verification flow** for new accounts
- **In-memory TTL caching** for read-heavy storefront endpoints
- **Structured logging** with Pino + request logging, plus a deep `/health` check (DB ping + memory)
- **Route-level code splitting** (`React.lazy`) keeps the initial bundle small
- **Automated tests** (Vitest + Supertest) for auth, checkout, and coupons
- **CI** via GitHub Actions (server tests + client build)

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, Vite 6, React Router 6, Redux Toolkit, Tailwind CSS, Axios, Recharts, react-helmet-async |
| **Backend** | Node.js (>=18), Express 4, Mongoose 8, Zod, JWT, bcryptjs, Helmet, CORS, Pino, Nodemailer, Multer, Cloudinary |
| **Database** | MongoDB (replica set — Atlas in prod, in-memory replica set in dev/test) |
| **Tooling** | Vitest, Supertest, ESLint, Nodemon, GitHub Actions |

---

## Project Structure

```
ENUGU/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── app/            # App root + providers
│       ├── components/     # Reusable UI (auth, home, etc.)
│       ├── config/         # routes, env
│       ├── layouts/        # Customer/Admin/Auth layouts
│       ├── pages/          # Route pages (storefront, admin, account, auth, errors)
│       ├── routes/         # Code-split route definitions + guards
│       ├── services/       # Axios client, API modules, in-memory token store
│       └── store/          # Redux slices
│
├── server/                 # Express + MongoDB API
│   ├── src/
│   │   ├── config/         # env, db, logger, cors, cloudinary
│   │   ├── constants/      # roles, statuses, permissions
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # auth, rate-limit, validation, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/v1/      # Versioned REST routes
│   │   ├── services/       # Business logic (checkout, inventory, email, ...)
│   │   ├── seeds/          # Dev/super-admin seeding
│   │   └── utils/          # Transactions, cache, pagination, tokens
│   └── test/               # Vitest + Supertest suites
│
├── docs/                   # API docs (auth, products)
├── .github/workflows/      # CI pipeline
├── DEPLOYMENT.md           # Production deployment guide
└── LOCAL_SETUP.md          # Quick local setup
```

---

## Prerequisites

- **Node.js >= 18**
- **npm**
- MongoDB is **optional for local dev** — the server spins up an in-memory MongoDB replica set automatically when `MONGODB_URI=memory`. For production use [MongoDB Atlas](https://www.mongodb.com/atlas).

---

## Getting Started

Clone the repo and run the backend and frontend in two terminals.

```bash
git clone https://github.com/Pavan76652/ENUGU-E-COMMERCE.git
cd ENUGU-E-COMMERCE
```

### 1. Backend

```bash
cd server
cp .env.example .env        # then edit values (see below)
npm install
npm run dev                 # http://localhost:5000
```

Wait for:

```
Using in-memory MongoDB replica set for local development
MongoDB connected
ENUGU API running on port 5000
```

### 2. Frontend

```bash
cd client
cp .env.example .env        # then edit values
npm install
npm run dev                 # http://localhost:5173
```

Open **http://localhost:5173**.

> Windows PowerShell users: use `Copy-Item .env.example .env` instead of `cp`.

---

## Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `development` / `production` / `test` |
| `PORT` | Yes | API port (default `5000`) |
| `CLIENT_URL` | Yes | Frontend origin (e.g. `http://localhost:5173`) |
| `LOG_LEVEL` | No | `info` (default), `debug`, `warn`, etc. |
| `MONGODB_URI` | Yes | `memory` for dev, or an Atlas/Mongo URI |
| `JWT_ACCESS_SECRET` | Yes | 32+ char secret |
| `JWT_REFRESH_SECRET` | Yes | 32+ char secret |
| `BCRYPT_SALT_ROUNDS` | No | Default `12` |
| `CLOUDINARY_*` | For uploads | Cloud name, API key, secret |
| `RAZORPAY_*` | Later | Payment keys (stubbed for now) |
| `CORS_ORIGINS` | Yes | Comma-separated allowed origins |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | No | Enables real email; logs to console if unset |
| `EMAIL_FROM` | No | From-address for outgoing mail |
| `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` | Seed | For `npm run seed:super-admin` |

### Client (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_APP_NAME` | App name (`ENUGU`) |
| `VITE_API_BASE_URL` | API base (`http://localhost:5000/api/v1`) |
| `VITE_SITE_URL` | Public site URL |
| `VITE_FREE_SHIPPING_THRESHOLD` | Free shipping threshold |
| `VITE_SUPPORT_EMAIL` / `VITE_WHATSAPP_NUMBER` / `VITE_INSTAGRAM_URL` | Contact/social links |

> **Never commit `.env` files** — they are gitignored. Use `.env.example` as the template.

---

## NPM Scripts

### Server

| Script | Description |
|--------|-------------|
| `npm run dev` | Start API with nodemon |
| `npm start` | Start API (production) |
| `npm test` | Run Vitest + Supertest suite |
| `npm run test:watch` | Tests in watch mode |
| `npm run seed:super-admin` | Seed a super admin (requires real Mongo URI) |
| `npm run verify` | Verify route wiring |

### Client

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build (`dist/`) |
| `npm run preview` | Preview the production build |

---

## Testing

The backend ships with automated tests covering critical paths:

- **Auth** — register, login, refresh, duplicate-email handling
- **Checkout** — atomic stock decrement, oversell prevention, stock restoration on cancel
- **Coupons** — validation, expiry, minimum-order, usage limits

```bash
cd server
npm test
```

Tests run against an isolated in-memory MongoDB **replica set** (so transactions behave exactly as in production). CI runs these automatically on every push/PR.

---

## API Overview

Base URL: `/api/v1`

| Resource | Routes |
|----------|--------|
| Auth | `/auth/*` — register, login (customer/admin/super-admin), refresh, logout, verify-email, password reset |
| Products | `/products/*` — storefront listing, PDP, admin CRUD |
| Orders | `/orders/*` — checkout, my-orders, admin order management |
| Coupons | applied at checkout, full admin CRUD |
| Campaigns | `/campaigns/*` — popups/banners |
| Wishlist | `/wishlist/*` |
| Design Requests | `/design-requests/*` — custom design workflow |
| Stock Notifications | `/stock-notifications/*` |
| Addresses | `/addresses/*` |
| Contact | `/contact` |
| SEO | `/seo/sitemap.xml` |
| Health | `/health` — DB ping + memory diagnostics |

Detailed docs: [`docs/api-auth.md`](docs/api-auth.md), [`docs/api-products.md`](docs/api-products.md).

---

## Default Credentials

In development (in-memory DB), the server auto-seeds accounts on each boot:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `admin@enugu.com` | `Enugu@Admin123` |
| Admin | `manager@enugu.com` | `Manager@123` |
| Customer | `customer@enugu.com` | (see seed output) |

Admin login: **http://localhost:5173/admin/login**

> These are **development seeds only**. Set strong `SUPER_ADMIN_*` values and seed manually in production.

---

## Deployment

Recommended setup:

| Layer | Platform |
|-------|----------|
| Frontend | Vercel |
| Backend | Railway / Render |
| Database | MongoDB Atlas |

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for the full step-by-step guide (env vars, proxy/cookie config, post-deploy checklist).

---

## Security Notes

- **Access tokens are kept in memory only** — never written to `localStorage` (reduces XSS risk). Sessions are restored via a silent refresh against an **httpOnly refresh-token cookie**.
- Passwords hashed with bcrypt; JWT access/refresh token rotation.
- Helmet, CORS allowlist, Mongo sanitization, request rate limiting, and Zod input validation are enabled.
- Refresh cookies use `httpOnly` + `secure` + `sameSite=none` in production.

---

## Documentation

- [LOCAL_SETUP.md](LOCAL_SETUP.md) — quick local setup & troubleshooting
- [DEPLOYMENT.md](DEPLOYMENT.md) — production deployment guide
- [docs/api-auth.md](docs/api-auth.md) — auth API reference
- [docs/api-products.md](docs/api-products.md) — products API reference

---

## License

UNLICENSED — proprietary. © ENUGU. All rights reserved.

**Contact:** goudarjun763@gmail.com · WhatsApp +91 7989528173
