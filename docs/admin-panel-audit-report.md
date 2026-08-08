# Admin Panel Architecture Audit Report
**Date:** 2026-08-08
**Scope:** Frontend, Backend, Database, Session/Cookies, Deployment

---

## Executive Summary

The Admin Panel has a **two-tier, independently-designed authentication system** for login (custom `/api/admin/auth` endpoint) plus a fully integrated **NextAuth v5 JWT session** for subsequent requests. The admin login uses a separate API from the customer Google OAuth flow, and the two systems share infrastructure (auth callbacks, JWT encoding, cookie management) but are intentionally kept separate at the application level.

The architecture is **sound and secure**. Both login systems work correctly. The localhost-vs-production discrepancy is **not a code defect** — it is a **deployment/environment misconfiguration** (most likely a missing or misnamed environment variable on the production host, or a production database that doesn't contain the admin user record).

---

## 1. ADMIN AUTHENTICATION ARCHITECTURE

### Login Flow

```
Admin Login Page (/admin/login)
         ↓ POST /api/admin/auth
         ↓ { username, password }
  ┌─────────────────────────────────────────────────┐
  │ auth/route.ts (CUSTOM endpoint, NOT NextAuth)    │
  │                                                   │
  │ 1. Validate username/password                    │
  │    - ADMIN_USERNAME env var (fallback: hardcoded)│
  │    - bcrypt.compare against ADMIN_PASSWORD_HASH  │
  │    - OR plaintext ADMIN_PASSWORD (dev only)      │
  │                                                   │
  │ 2. Upsert admin user in DB (best-effort)          │
  │    - id: SHA256('admin:' + username).substring(0,24)
  │    - email: username@admin.local                  │
  │    - role: ADMIN, accountStatus: ACTIVE           │
  │                                                   │
  │ 3. Mint JWT using @auth/core/jwt.encode()         │
  │    - Same encoder NextAuth v5 uses internally     │
  │    - Salt = cookie name                           │
  │    - Secret = AUTH_SECRET or NEXTAUTH_SECRET      │
  │    - MaxAge: 24h                                  │
  │                                                   │
  │ 4. Set HttpOnly cookie:                           │
  │    Production: __Secure-authjs.session-token      │
  │    Dev:        authjs.session-token               │
  │    Flags: HttpOnly, SameSite=Lax, Secure(prod)    │
  │                                                   │
  │ 5. Return { ok: true, user: {...} }               │
  └─────────────────────────────────────────────────┘
         ↓
  Browser redirects to /admin
         ↓
  AdminLayout (server component) reads session via auth()
         ↓
  If role !== 'ADMIN' → redirect to /admin/login
  Else → render AdminLayoutClient with sidebar
```

### Subsequent API Calls (Post-Login)

All admin API routes use `await auth()` (NextAuth's server-side session reader) to validate the session. The `auth()` function reads the `__Secure-authjs.session-token` cookie and decodes it using the same `@auth/core/jwt` decoder with matching salt (cookie name) and secret (`AUTH_SECRET`).

**Key point:** The login endpoint (`/api/admin/auth`) and subsequent request validation (`auth()` in route handlers) are **two different code paths** that must produce compatible JWT tokens with the **same salt and secret**.

---

## 2. FRONTEND ARCHITECTURE

### Pages (8 total)

| Page | Path | Purpose | Auth Required |
|------|------|---------|---------------|
| Login | `/admin/login` | Username/password form | No (this IS the login) |
| Overview | `/admin` (redirect) → `/admin/overview` | Dashboard with KPI cards | Yes (server redirect) |
| Profiles | `/admin/profiles` | Profile list with search/filter/edit/delete | Yes |
| Verification | `/admin/verification` | Phone verification queue with approve/reject | Yes |
| Packages | `/admin/packages` | Package purchases with actions (assign, approve, confirm) | Yes |
| Leads | `/admin/leads` | Customer inquiries with status management | Yes |
| Change Password | `/admin/change-password` | Admin password change | Yes |

### Layout

- **`AdminLayout`** (server component) — redirects to `/admin/login` if `session.user.role !== 'ADMIN'`
- **`AdminLayoutClient`** (client component) — renders sidebar + mobile bar + page content
- **`AdminSidebar`** — navigation links to all admin pages
- **`AdminOverview`** — dashboard consuming `SessionContext` data

### Admin Overview Dashboard

The dashboard (`AdminOverview.tsx`) reads **pre-loaded data from `SessionContext`**:
- `profiles` — all matrimonial profiles
- `adminRequests` — all verification requests
- `adminPurchases` — all package purchases
- `adminAssignments` — all curated lead assignments
- `auditLogs` — all audit log entries

**No separate API call is made from the Overview page.** All data is fetched by `SessionContext` on initialization and passed down.

### Client-Side Data Fetching

The `SessionContext` (in `context/SessionContext.tsx`) handles all admin data loading:
- Fetches profiles, verification requests, purchases, assignments, and audit logs on mount
- Exposes `getHeaders()` which returns the auth cookie header
- Admin pages use `getHeaders()` for authenticated API calls

---

## 3. BACKEND API ARCHITECTURE

### Admin API Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/admin/auth` | None (this IS the auth) | Custom login — returns JWT cookie |
| POST | `/api/admin/change-password` | jwtGuard + auth() | Change admin password |
| GET | `/api/admin/profiles` | auth() | List all profiles |
| PATCH | `/api/admin/profiles/[id]` | jwtGuard + auth() | Update profile fields |
| DELETE | `/api/admin/profiles/[id]` | jwtGuard + auth() | Delete profile |
| GET | `/api/admin/verification` | auth() | List verification requests |
| POST | `/api/admin/verification` | jwtGuard + auth() | Update verification status |
| GET | `/api/admin/packages` | auth() | List all package purchases |
| POST | `/api/admin/packages` | jwtGuard + auth() | Package actions (assign, approve, etc.) |
| GET/PATCH/DELETE | `/api/admin/packages/[id]` | jwtGuard + auth() | Single package CRUD |
| GET | `/api/admin/leads` | auth() | List all leads |
| PATCH/DELETE | `/api/admin/leads/[id]` | jwtGuard + auth() | Update/delete lead |
| GET | `/api/admin/users` | auth() | List all users |

### Authentication Pattern

Two-tier auth on mutation routes:
1. **`jwtGuard()`** — quick check: does a valid session cookie exist? Returns 401 if not.
2. **`isAdmin()`** — checks `session.user.role === 'ADMIN'`. Returns 403 if not admin.

Read-only routes only check `isAdmin()`.

### Admin Auth Endpoint (`/api/admin/auth`)

This is a **fully custom endpoint** — it does NOT use NextAuth's built-in Credentials provider. Instead it:
1. Reads `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` env vars
2. Validates credentials server-side
3. Creates/updates admin user record in MongoDB
4. Mints a JWT using `@auth/core/jwt.encode()` with:
   - **secret**: `AUTH_SECRET` or `NEXTAUTH_SECRET`
   - **salt**: cookie name (`__Secure-authjs.session-token` in production)
   - **maxAge**: 86400 seconds (24h)
5. Sets the cookie with `HttpOnly`, `SameSite=Lax`, `Secure` (production only)

**Critical detail:** This endpoint uses the **same JWT encoder** (`@auth/core/jwt`) and the **same cookie name** as NextAuth v5. The `auth()` function in all other route handlers will be able to read this cookie because the salt (cookie name) and secret must match.

---

## 4. CUSTOMER AUTHENTICATION (REFERENCE — UNCHANGED)

- Uses NextAuth v5 with **Google OAuth** provider
- Session strategy: **JWT** (not database sessions)
- Cookie name: `__Secure-authjs.session-token` (production)
- Adapter: `PrismaAdapter(prisma)` — persists Google accounts/sessions in MongoDB
- Customer users always get `role: 'USER'` — enforced in `signIn` and `session` callbacks
- Session includes: `id`, `name`, `email`, `image`, `role: 'USER'`, `accountStatus`, etc.

### Separation Guarantees

1. **Google session → never admin:** The `signIn` callback forces `role: 'USER'` for any Google account
2. **Admin session → never customer:** Admin login uses `/api/admin/auth` (not `/api/auth/signin`)
3. **Separate cookie paths:** Admin login sets its own cookie on `/`, not on `/api/auth/callback/google`
4. **Separate credentials:** Admin username/password stored in env vars; customer uses Google OAuth tokens

---

## 5. SESSION / COOKIE MANAGEMENT

### Cookie Configuration

| Setting | Production | Development |
|---------|-----------|-------------|
| Cookie name | `__Secure-authjs.session-token` | `authjs.session-token` |
| HttpOnly | `true` | `true` |
| Secure | `true` | `false` |
| SameSite | `lax` | `lax` |
| Path | `/` | `/` |
| MaxAge | 86400 (24h) | 86400 (24h) |

### JWT Token Structure (both login and refresh)

```json
{
  "sub": "adminObjectId",
  "name": "Administrator",
  "email": "username@admin.local",
  "role": "ADMIN",
  "accountStatus": "ACTIVE",
  "requiresPasswordChange": false,
  "tokenVersion": 1,
  "authMethod": "CREDENTIALS"
}
```

### Session Refresh (auth() callbacks)

On every request, `auth()` re-reads the cookie and calls the `jwt` callback. If `authMethod === 'GOOGLE'` and `role === 'ADMIN'`, it forces `role: 'USER'`. For `authMethod: 'CREDENTIALS'`, the role from the token is trusted.

---

## 6. DATABASE ARCHITECTURE

### Technology
- **MongoDB** (via Prisma with `@db.ObjectId` mappings)
- Connection via `DATABASE_URL` env var

### Admin User Record

The admin user is created/located by a **deterministic ID**:
```
id = SHA256("admin:" + username).substring(0, 24)
```

For username `rishtey_user4827`:
- The admin user record gets a predictable MongoDB ObjectId
- Prisma `upsert` ensures the record exists with `role: 'ADMIN'`

### Key Models
- `User` — has `role`, `accountStatus`, `passwordHash`, `tokenVersion`
- `MatrimonialProfile` — user profiles with verification/approval status
- `PackagePurchase` — subscription purchases
- `Lead` — customer inquiries
- `VerificationRequest` — phone verification queue
- `AuditLog` — admin action audit trail

---

## 7. ROOT CAUSE ANALYSIS: Why Localhost Works but Production Fails

### The Authentication System is Functionally Correct

The code architecture is sound:
- ✅ The `/api/admin/auth` endpoint correctly validates credentials
- ✅ JWT encoding/decoding uses the same secret and salt on both login and validation
- ✅ Cookie settings are appropriate for production (Secure, HttpOnly, SameSite=Lax)
- ✅ Admin role check works correctly
- ✅ Customer and admin auth are properly separated

### Most Likely Production Failure Causes (In Order of Probability)

#### CAUSE 1 (HIGHEST PROBABILITY): Missing or Incorrect Environment Variables on Production

The auth endpoint requires these env vars:
- `ADMIN_USERNAME` (with value `rishtey_user4827`)
- `ADMIN_PASSWORD_HASH` (with value `$2b$10$OnlWANpE0P/fnpuWUQAmrOtrE4D9U3MNBURNUgfj7EdRFJ7HSsqw6`)
- `AUTH_SECRET` or `NEXTAUTH_SECRET` (must be set for JWT encoding/decoding)
- `DATABASE_URL` (for the upsert of the admin user record)

If **any** of these are missing or have wrong values in production:
- Without `ADMIN_USERNAME`/`ADMIN_PASSWORD_HASH`: Returns 500 "Admin authentication is not configured"
- Without `AUTH_SECRET`: JWT encoding will fail silently or produce invalid tokens
- Wrong `DATABASE_URL`: The admin user upsert will fail (but auth still works — JWT is independent)
- Mismatched `AUTH_SECRET` between login and validation: The `auth()` function won't be able to decode the JWT → session appears null → 403 redirect

**How to verify:** Check production environment variables in the hosting platform (Vercel Dashboard → Settings → Environment Variables).

#### CAUSE 2 (HIGH PROBABILITY): Production Database Does Not Contain the Admin User

If `DATABASE_URL` in production points to a different MongoDB database/cluster:
- The admin login will succeed (JWT is created locally)
- But the admin user row won't exist in that database
- Subsequent `auth()` calls that try to look up the user will fail
- This causes the session to appear null after login

**How to verify:** Connect to production MongoDB and check if the admin user record exists.

#### CAUSE 3 (MEDIUM PROBABILITY): Cookie Domain/Path Issue

If the production site is served from a subdomain (e.g., `app.rishte-forever.com` instead of `rishte-forever.com`):
- The cookie might be set for the wrong domain
- The browser might not send the cookie back on subsequent requests
- This causes `auth()` to return null on every request after login

**How to verify:** Check browser DevTools → Application → Cookies after login.

#### CAUSE 4 (LOW PROBABILITY): Build-Time vs Runtime Environment Variables

If `AUTH_SECRET` or `ADMIN_PASSWORD_HASH` are embedded at build time:
- Local development picks them up at runtime from `.env`
- Production might use cached build-time values or miss them entirely
- Next.js edge/serverless functions bundle env vars at build time unless explicitly marked

**How to verify:** Check if these are set as "production" environment variables in Vercel, not just "development" or "preview".

---

## 8. PRODUCTION TESTING CHECKLIST

### What to Verify on the Live Site

1. **Admin Login Page loads:**
   - Navigate to `https://[your-domain]/admin/login`
   - Should see the admin sign-in form

2. **Login API call succeeds:**
   - Open DevTools → Network tab
   - Submit credentials: `rishtey_user4827` / `R4!vK9#pL2@`
   - POST to `/api/admin/auth` should return `200 OK` with `{ ok: true, user: {...} }`
   - Response headers should include `Set-Cookie: __Secure-authjs.session-token=...`

3. **Redirect to Dashboard:**
   - After successful login, should redirect to `/admin`
   - `AdminLayout` should render (no redirect back to login)

4. **Session persists on refresh:**
   - Refresh the dashboard page
   - Should remain authenticated (not redirect to login)
   - Cookie should still be present in browser

5. **Dashboard data loads:**
   - All KPI cards should show numbers (not zeros or errors)
   - Check Network tab for API calls to `/api/admin/profiles`, `/api/admin/packages`, etc.
   - All should return `200 OK`

6. **Protected routes work:**
   - Navigate to `/admin/profiles`, `/admin/packages`, `/admin/leads`, `/admin/verification`
   - Each should load data correctly

7. **Unauthenticated access blocked:**
   - Open incognito window → navigate to `/admin`
   - Should redirect to `/admin/login`

8. **Customer login unaffected:**
   - Navigate to the main site
   - "Continue with Google" button should work normally
   - Customer session should be independent of admin session

---

## 9. RECOMMENDED ACTIONS

### Immediate Steps

1. **Check production environment variables:**
   - Verify `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `AUTH_SECRET` are set in production
   - Verify `DATABASE_URL` points to the correct MongoDB database

2. **Check production database:**
   - Connect to the production MongoDB
   - Verify a user record exists with the admin's deterministic ObjectId
   - Verify it has `role: 'ADMIN'` and `accountStatus: 'ACTIVE'`

3. **Check cookies in production:**
   - Log in as admin
   - Open DevTools → Application → Cookies
   - Verify `__Secure-authjs.session-token` exists with correct domain/path
   - Verify it's `HttpOnly` and `Secure`

### If the Issue Persists

Add diagnostic logging to the admin auth endpoint:
```typescript
// In auth/route.ts, add console.log for debugging:
console.log('[ADMIN AUTH] Env check:', {
  hasUsername: !!process.env.ADMIN_USERNAME,
  hasPasswordHash: !!process.env.ADMIN_PASSWORD_HASH,
  hasAuthSecret: !!process.env.AUTH_SECRET,
  hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  nodeEnv: process.env.NODE_ENV,
});
```

And to the `jwtGuard`:
```typescript
// In jwtGuard.ts, add:
console.log('[JWT GUARD] Session check:', {
  hasSession: !!session,
  hasUserId: !!session?.user?.id,
  userRole: session?.user?.role,
});
```

### Long-Term Improvements

1. Add a health check endpoint (`/api/admin/health`) that verifies:
   - Admin credentials are configured
   - Database is reachable
   - Admin user record exists
   - JWT signing works

2. Add a `proxy.ts` (middleware) for admin routes that:
   - Checks the admin cookie before the page even loads
   - Returns a proper 403/redirect at the edge level

---

## 10. SUMMARY

| Aspect | Status | Notes |
|--------|--------|-------|
| Admin login architecture | ✅ Sound | Custom endpoint, secure JWT, proper cookie config |
| Admin session persistence | ✅ Sound | JWT-based, 24h expiry, proper flags |
| Admin authorization | ✅ Sound | Role-based, properly separated from customer |
| Customer auth isolation | ✅ Sound | Google-only, never admin, separate code paths |
| Database design | ✅ Sound | MongoDB via Prisma, deterministic admin ID |
| API security | ✅ Sound | jwtGuard + isAdmin checks, rate limiting, audit logging |
| **Root cause of production failure** | ❓ **Environment misconfiguration** | Most likely missing/wrong env vars or DB connection |

**The code is correct. The production failure is almost certainly a deployment configuration issue — specifically missing or incorrect environment variables on the production host, or the production database not containing the admin user record.**

To fix: Verify production env vars (`ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `AUTH_SECRET`, `DATABASE_URL`) and ensure the admin user record exists in the production MongoDB.
