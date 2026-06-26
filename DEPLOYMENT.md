# ENUGU Deployment Guide

Deploy the ENUGU stack as **three separate pieces**:

| Layer | Platform | Notes |
|-------|----------|--------|
| Frontend | **Netlify** (or Vercel) | React/Vite SPA |
| Backend | **Render** (or Railway) | Node/Express API |
| Database | **MongoDB Atlas** | Managed MongoDB |

> **Why your products only show locally:** the frontend on Netlify is only the
> website. The backend + database (where products live) must also be hosted
> online. Until they are, the live site has no server to talk to. Follow the
> Quick Start below to host all three pieces so changes appear everywhere.

---

## Quick Start — Netlify + Render + Atlas (recommended)

This is the fastest path to make admin changes show up on the live site from any device.

### Step 1 — MongoDB Atlas (your database)

1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas) → create a **free M0 cluster**.
2. **Database Access** → add a database user (username + password). Save these.
3. **Network Access** → Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`).
4. **Database** → **Connect** → **Drivers** → copy the connection string and insert your
   password and `enugu` as the database name:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/enugu?retryWrites=true&w=majority
   ```

### Step 2 — Backend on Render (your API)

1. Sign up at [render.com](https://render.com) with your GitHub account.
2. **New + → Blueprint** → pick the `ENUGU-E-COMMERCE` repo. Render reads the root
   `render.yaml` and creates the `enugu-api` service automatically.
3. When prompted, fill in the values (JWT secrets are generated for you):
   | Variable | Value |
   |----------|-------|
   | `MONGODB_URI` | the Atlas string from Step 1 |
   | `CLIENT_URL` | your Netlify URL, e.g. `https://enugu-shopping.netlify.app` |
   | `CORS_ORIGINS` | the same Netlify URL |
   | `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | from your Cloudinary dashboard |
   | `SUPER_ADMIN_EMAIL` | the admin email you want |
   | `SUPER_ADMIN_PASSWORD` | a strong admin password |
4. Deploy. Copy the public URL, e.g. `https://enugu-api.onrender.com`.
5. Verify it works: open `https://enugu-api.onrender.com/api/v1/health` → should return JSON.

> The super admin account is created automatically on first boot, so you can log
> in at `/admin/login` right away — no manual seed step needed.

### Step 3 — Point Netlify at the backend

1. Netlify → your site → **Site configuration → Environment variables** → add:
   | Variable | Value |
   |----------|-------|
   | `VITE_API_BASE_URL` | `https://enugu-api.onrender.com/api/v1` |
   | `VITE_SITE_URL` | your Netlify URL |
2. **Trigger a redeploy** (Deploys → Trigger deploy → Clear cache and deploy).
   Vite bakes env vars in at build time, so a rebuild is required.

### Step 4 — Confirm

- Open the live Netlify site, go to `/admin/login`, log in with the super admin.
- Add a product → it now saves to Atlas via Render and appears for **everyone, on every device**.

> **Note on Render free tier:** the API "sleeps" after ~15 min idle, so the first
> request after a pause can take ~30–50s. Upgrade the plan to remove cold starts.

---

## Prerequisites

- [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (M0 free tier works for staging)
- [Vercel](https://vercel.com) account
- [Railway](https://railway.app) or [Render](https://render.com) account
- [Cloudinary](https://cloudinary.com) account (product images, design uploads)
- Domain (optional) — e.g. `enugu.com`

---

## 1. MongoDB Atlas

1. Create a cluster → **Database** → **Connect** → **Drivers**.
2. Copy connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/enugu?retryWrites=true&w=majority
   ```
3. **Network Access** → Add IP `0.0.0.0/0` (or Railway/Render egress IPs in production).
4. Create database user with read/write on `enugu` database.

---

## 2. Backend (Railway or Render)

### Root directory

Set service root to **`server/`** (not repo root).

### Environment variables

Copy from `server/.env.example` and set in Railway/Render dashboard:

| Variable | Required | Example |
|----------|----------|---------|
| `NODE_ENV` | Yes | `production` |
| `PORT` | Yes | `5000` |
| `CLIENT_URL` | Yes | `https://your-app.vercel.app` |
| `MONGODB_URI` | Yes | Atlas connection string |
| `JWT_ACCESS_SECRET` | Yes | 32+ char random string |
| `JWT_REFRESH_SECRET` | Yes | 32+ char random string |
| `CORS_ORIGINS` | Yes | `https://your-app.vercel.app` |
| `CLOUDINARY_*` | For uploads | Cloud name, API key, secret |
| `SMTP_*` | Optional | Email notifications |
| `SUPER_ADMIN_EMAIL` | Seed | Admin email |
| `SUPER_ADMIN_PASSWORD` | Seed | Strong password |

Generate secrets (PowerShell):

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Deploy on Railway

1. New Project → **Deploy from GitHub** → select repo.
2. Set **Root Directory** = `server`.
3. Railway reads `server/railway.toml` (health check: `/api/v1/health`).
4. Add all env vars → Deploy.
5. Copy public URL: `https://enugu-api-production.up.railway.app`.

### Deploy on Render

1. New **Web Service** → connect repo.
2. **Root Directory**: `server`
3. **Build**: `npm install`
4. **Start**: `npm start`
5. Or use `server/render.yaml` as blueprint.
6. Health check path: `/api/v1/health`

### Seed super admin

The super admin is **created automatically on server boot** from `SUPER_ADMIN_EMAIL`
and `SUPER_ADMIN_PASSWORD`, in every environment — no manual step required.

To (re)create it manually against a production database, you can still run:

```bash
cd server
npm run seed:super-admin
```

### Verify API

```bash
curl https://YOUR_API_URL/api/v1/health
```

Expected: `{ "success": true, ... }`

---

## 3. Frontend (Vercel)

### Root directory

Set to **`client/`**.

### Environment variables

| Variable | Production value |
|----------|------------------|
| `VITE_APP_NAME` | `ENUGU` |
| `VITE_APP_TAGLINE` | `Made to Stand Out` |
| `VITE_SITE_URL` | `https://your-app.vercel.app` |
| `VITE_API_BASE_URL` | `/api/v1` (recommended with proxy) **or** `https://YOUR_API_URL/api/v1` |
| `VITE_FREE_SHIPPING_THRESHOLD` | `999` |
| `VITE_SUPPORT_EMAIL` | your support email |
| `VITE_WHATSAPP_NUMBER` | `+917989528173` |
| `VITE_INSTAGRAM_URL` | Instagram profile URL |

### API proxy (recommended)

Using a same-origin proxy keeps auth cookies working.

1. Edit `client/vercel.json` — replace `YOUR_RAILWAY_OR_RENDER_API_URL` with your backend host (no trailing slash):

   ```json
   "destination": "https://enugu-api-production.up.railway.app/api/:path*"
   ```

2. Set `VITE_API_BASE_URL=/api/v1`

3. Set backend `CLIENT_URL` and `CORS_ORIGINS` to your Vercel URL.

### Deploy

```bash
cd client
npm run build
```

Vercel auto-builds on git push if connected. Manual:

```bash
npx vercel --prod
```

**Build settings**

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

### SPA routing

`vercel.json` rewrites all non-API routes to `index.html` for React Router.

---

## 4. Production build (local)

### Backend

```bash
cd server
npm install
npm start
```

### Frontend

```bash
cd client
npm install
npm run build
npm run preview   # serves dist/ on port 4173
```

---

## 5. Post-deploy checklist

| Check | URL / Action |
|-------|----------------|
| API health | `GET /api/v1/health` |
| Shop loads | `/shop` |
| Product by slug | `/product/:slug` |
| Customer register/login | `/register`, `/login` |
| Cart & checkout (COD) | `/cart` → `/checkout` |
| Admin login | `/admin/login` |
| Admin coupons | `/admin/coupons` |
| Admin campaigns | `/admin/campaigns` |
| Design requests | `/admin/design-requests` |
| Analytics | `/admin/analytics` |
| Wishlist (logged in) | `/account/wishlist` |
| Contact form | `/contact` |
| SEO sitemap | `/api/v1/seo/sitemap.xml` |
| Legal pages | `/privacy-policy`, etc. |

---

## 6. Cross-origin auth notes

- Refresh tokens use **httpOnly cookies** with `sameSite: none` + `secure` in production.
- **Recommended**: Vercel `/api` proxy so browser treats API as same origin.
- **Alternative**: Direct API URL — ensure `CORS_ORIGINS` includes Vercel URL and `credentials: true` (already configured).
- Access tokens are held **in memory only** (never persisted to `localStorage`) and sent via `Authorization: Bearer`. On page load the client performs a silent refresh against the httpOnly cookie to restore the session — so the `/api` proxy (or correct cross-origin cookie config) is required for sessions to survive a refresh.

---

## 7. Cloudinary & email

- Without Cloudinary: design request image upload returns 503; product admin uploads fail.
- Without SMTP: password reset, back-in-stock, and contact emails log to server console in dev.

---

## 8. Custom domain

**Vercel**: Project → Domains → add domain → update DNS.

**Backend**: Set `CLIENT_URL` and `CORS_ORIGINS` to custom domain.

**Atlas**: No change if using SRV connection string.

---

## 9. Monitoring

- Railway/Render: use built-in logs and health checks.
- Atlas: Metrics → monitor connections and storage.
- Vercel: Analytics + deployment logs.

---

## 10. Module integration status

| Module | API | Customer UI | Admin UI |
|--------|-----|-------------|----------|
| Auth | ✅ | ✅ Login/Register | ✅ Admin login |
| Products | ✅ | ✅ Shop/PDP | ⏳ Placeholder pages |
| Orders | ✅ | ✅ Checkout | ⏳ Placeholder pages |
| Coupons | ✅ | ✅ Cart/Checkout | ✅ Full CRUD |
| Campaigns | ✅ | ✅ Popup/Banner | ✅ Full CRUD |
| Custom design | ✅ | ✅ Form | ✅ Management |
| Wishlist | ✅ | ✅ Account | — |
| Stock notify | ✅ | ✅ PDP | — |
| Contact | ✅ | ✅ Form | — |
| Analytics | ✅ | — | ✅ Dashboard |
| Admin dashboard | ✅ | — | ✅ Overview |
| SEO/Legal | ✅ | ✅ | — |

⏳ = API ready; UI is `PageShell` placeholder — wire using existing `adminApi` / `productApi.admin` patterns.

---

## Quick reference

```bash
# Local development
cd server && npm run dev    # http://localhost:5000
cd client && npm run dev    # http://localhost:5173 (proxies /api)

# Production builds
cd server && npm start
cd client && npm run build
```

**Support**: `goudarjun763@gmail.com` | WhatsApp: +91 7989528173
