# ENUGU API — Authentication Module

**Base URL:** `http://localhost:5000/api/v1`  
**Version:** v1  
**Auth scheme:** Bearer JWT (access token) + httpOnly cookie (refresh token)

---

## Overview

The authentication module supports three roles:

| Role | Value | Login endpoint |
|------|-------|----------------|
| Customer | `customer` | `POST /auth/login/customer` |
| Admin | `admin` | `POST /auth/login/admin` |
| Super Admin | `super_admin` | `POST /auth/login/super-admin` |

Each role must use its designated login portal. Using the wrong portal returns `403`.

---

## Token Strategy

| Token | Lifetime | Delivery | Usage |
|-------|----------|----------|-------|
| Access Token | 15 minutes (configurable) | JSON response body | `Authorization: Bearer <token>` |
| Refresh Token | 7 days (configurable) | httpOnly cookie + JSON body on login/reset | `POST /auth/refresh-token` |

On logout or password change, the refresh token is revoked server-side.

---

## Standard Response Format

### Success

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "password", "message": "Password must be at least 8 characters" }
  ],
  "requestId": "uuid"
}
```

---

## Endpoints

### 1. Customer Registration

Creates a new customer account and returns auth tokens.

```
POST /auth/register
```

**Access:** Public  
**Rate limit:** Auth rate limiter (10 req / 15 min in production)

**Request body:**

```json
{
  "firstName": "Arjun",
  "lastName": "Gouda",
  "email": "customer@example.com",
  "phone": "7989528173",
  "password": "SecurePass1"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| firstName | string | Yes | 2–50 chars |
| lastName | string | No | Max 50 chars |
| email | string | Yes | Valid email, unique |
| phone | string | No | 10-digit Indian mobile (6–9 start) |
| password | string | Yes | Min 8, 1 upper, 1 lower, 1 number |

**Response:** `201 Created`

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "665f...",
      "firstName": "Arjun",
      "lastName": "Gouda",
      "email": "customer@example.com",
      "phone": "7989528173",
      "role": "customer",
      "permissions": [],
      "isEmailVerified": false,
      "isActive": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**

| Status | Message |
|--------|---------|
| 400 | Validation failed |
| 409 | An account with this email already exists |

---

### 2. Customer Login

```
POST /auth/login/customer
```

**Access:** Public

**Request body:**

```json
{
  "email": "customer@example.com",
  "password": "SecurePass1"
}
```

**Response:** `200 OK` — same shape as registration.

**Errors:**

| Status | Message |
|--------|---------|
| 401 | Invalid email or password |
| 403 | Please use the customer login portal |
| 403 | Your account has been deactivated |

---

### 3. Admin Login

```
POST /auth/login/admin
```

**Access:** Public  
**Request body:** Same as customer login.

Only users with `role: "admin"` can authenticate via this endpoint.

**Errors:**

| Status | Message |
|--------|---------|
| 403 | Please use the admin login portal |

---

### 4. Super Admin Login

```
POST /auth/login/super-admin
```

**Access:** Public  
**Request body:** Same as customer login.

Only users with `role: "super_admin"` can authenticate via this endpoint.

**Seed super admin:**

```bash
# Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in .env
npm run seed:super-admin
```

---

### 5. Refresh Access Token

Issues a new access token using a valid refresh token.

```
POST /auth/refresh-token
```

**Access:** Public

**Option A — Cookie (recommended):**  
Refresh token is sent automatically via `refreshToken` httpOnly cookie.

**Option B — Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `200 OK` — new `accessToken` + rotated refresh cookie.

**Errors:**

| Status | Message |
|--------|---------|
| 401 | Refresh token required |
| 401 | Invalid or expired refresh token |
| 401 | Refresh token revoked or invalid |

---

### 6. Logout

Revokes the refresh token server-side and clears the cookie.

```
POST /auth/logout
```

**Access:** Protected (Bearer token required)

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

---

### 7. Get Current User Profile

```
GET /auth/me
```

**Access:** Protected (any authenticated role)

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Profile fetched",
  "data": {
    "user": {
      "id": "665f...",
      "firstName": "Arjun",
      "email": "customer@example.com",
      "role": "customer"
    }
  }
}
```

---

### 8. Change Password

```
PUT /auth/change-password
```

**Access:** Protected (any authenticated role)

**Request body:**

```json
{
  "currentPassword": "SecurePass1",
  "newPassword": "NewSecure2",
  "confirmPassword": "NewSecure2"
}
```

**Response:** `200 OK`

Invalidates all refresh tokens (forces re-login on other devices).

---

### 9. Forgot Password

Sends a password reset link. Always returns success to prevent email enumeration.

```
POST /auth/forgot-password
```

**Access:** Public

**Request body:**

```json
{
  "email": "customer@example.com"
}
```

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "If an account exists with this email, a reset link has been sent",
  "data": null
}
```

**Dev behavior:** If SMTP is not configured, the reset URL is logged to the server console.

Reset link format: `{CLIENT_URL}/reset-password?token=<token>`  
Token expires in **1 hour**.

---

### 10. Reset Password

```
POST /auth/reset-password
```

**Access:** Public

**Request body:**

```json
{
  "token": "abc123...",
  "password": "NewSecure2",
  "confirmPassword": "NewSecure2"
}
```

**Response:** `200 OK` — returns user + new access token (auto-login).

**Errors:**

| Status | Message |
|--------|---------|
| 400 | Password reset token is invalid or has expired |

---

## Protected Routes (Role-Based)

### Admin Profile

```
GET /auth/admin/me
```

**Access:** `admin` or `super_admin`

**Headers:** `Authorization: Bearer <accessToken>`

---

### Super Admin Profile

```
GET /auth/super-admin/me
```

**Access:** `super_admin` only

**Headers:** `Authorization: Bearer <accessToken>`

**Errors:**

| Status | Message |
|--------|---------|
| 403 | You do not have permission to perform this action |

---

## Middleware Reference

### `authenticate`

Verifies JWT access token and loads active user from database.

```javascript
import { authenticate } from '../middleware/auth.middleware.js';
router.get('/protected', authenticate, controller);
```

### `optionalAuthenticate`

Attaches user if token is valid; continues as guest otherwise.

### `authorize(...roles)`

```javascript
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';

router.get('/admin-only', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), controller);
```

### `isAdmin` / `isSuperAdmin`

Shorthand guards for admin and super-admin routes.

### `authorizePermission(...permissions)`

Granular permission check for admin users (super admin bypasses).

---

## JWT Payload

```json
{
  "sub": "665f1a2b3c4d5e6f7a8b9c0d",
  "email": "user@example.com",
  "role": "customer",
  "permissions": [],
  "iat": 1710000000,
  "exp": 1710000900
}
```

---

## Password Rules

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Hashed with **bcrypt** (12 rounds by default)

---

## Security Features

| Feature | Implementation |
|---------|----------------|
| Password hashing | bcrypt (configurable salt rounds) |
| Refresh token storage | SHA-256 hashed in database |
| Reset token storage | SHA-256 hashed, 1-hour expiry |
| Rate limiting | Auth endpoints: 10 req / 15 min (prod) |
| Email enumeration | Generic forgot-password response |
| Account deactivation | `isActive: false` blocks login and token refresh |
| CORS | Whitelist origins with credentials |
| Cookie security | httpOnly, secure in production, sameSite strict |

---

## Quick Test (cURL)

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","email":"test@enugu.com","password":"TestPass1"}'

# Customer login
curl -X POST http://localhost:5000/api/v1/auth/login/customer \
  -H "Content-Type: application/json" \
  -d '{"email":"test@enugu.com","password":"TestPass1"}'

# Get profile
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <accessToken>"

# Super admin login (after seed)
curl -X POST http://localhost:5000/api/v1/auth/login/super-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@enugu.com","password":"Enugu@Admin123"}'
```

---

## File Map

| File | Purpose |
|------|---------|
| `src/models/User.js` | User schema, password hashing, reset tokens |
| `src/services/auth.service.js` | Auth business logic |
| `src/services/email.service.js` | Password reset email delivery |
| `src/controllers/auth.controller.js` | HTTP handlers |
| `src/routes/v1/auth.routes.js` | Route definitions |
| `src/validators/auth.validator.js` | Zod request validation |
| `src/middleware/auth.middleware.js` | JWT verification |
| `src/middleware/role.middleware.js` | Role-based authorization |
| `src/utils/generateToken.js` | JWT sign/verify |
| `src/utils/hashToken.js` | SHA-256 for refresh/reset tokens |
| `src/seeds/superAdmin.seed.js` | Super admin bootstrap |
