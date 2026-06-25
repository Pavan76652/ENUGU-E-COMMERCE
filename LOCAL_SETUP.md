# Local Development — ENUGU

Run the full stack locally in **two terminals**.

## Quick start (no MongoDB install)

The project uses **in-memory MongoDB** when `MONGODB_URI=memory` in `server/.env` (already configured).

### Terminal 1 — Backend

```powershell
cd server
npm install
npm run dev
```

Wait for:

```
Using in-memory MongoDB replica set for local development
MongoDB connected
Dev super admin created: admin@enugu.com
ENUGU API running on port 5000
```

### Terminal 2 — Frontend

```powershell
cd client
npm install
npm run dev
```

Open http://localhost:5173

---

## Admin login

| Field | Value |
|-------|--------|
| URL | http://localhost:5173/admin/login |
| Email | `admin@enugu.com` |
| Password | `Enugu@Admin123` |

---

## Verify API

```powershell
Invoke-RestMethod http://localhost:5000/api/v1/health
```

---

## MongoDB options

| `MONGODB_URI` | Use case |
|---------------|----------|
| `memory` | Easiest local dev (data resets when server stops) |
| `mongodb://127.0.0.1:27017/enugu` | Local MongoDB Community Server |
| `mongodb+srv://...` | MongoDB Atlas (recommended before deployment) |

---

## Troubleshooting

### "Network Error" on login

- Backend not running → start `npm run dev` in `server/`
- Wrong API URL → `client/.env` should have `VITE_API_BASE_URL=http://localhost:5000/api/v1`
- Restart client after changing `.env`

### Server crashes on startup

- Check `server/.env` has valid `JWT_*` secrets (32+ chars)
- For local MongoDB, ensure MongoDB service is running

### Invalid credentials

- With `memory` DB, restart server (auto-creates admin again)
- Or run: `cd server && npm run seed:super-admin` (requires real MongoDB URI, not `memory`)
