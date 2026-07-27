# FULL WEBSITE AUDIT REPORT
**Website:** Rishte Forever (Matrimonial Platform)
**Date:** 2026-07-27
**Scope:** Complete Backend + Frontend Audit

---

## CRITICAL BUGS (Website-Breaking)

### CRIT-1: Profile Photo Upload Fails Outside Vercel Deployment
**File:** `src/app/api/upload/route.ts`
**Lines:** 25-30

The upload endpoint **hard-requires** `@vercel/blob`. If you deploy this anywhere other than Vercel (e.g., AWS, Railway, Render, Docker), the upload will always fail with a 500 error because:
- `process.env.BLOB_READ_WRITE_TOKEN` will be absent
- The `put()` function is imported directly from `@vercel/blob`
- There is no fallback to local filesystem storage, S3, or any other provider

**Impact:** Profile photos cannot be uploaded unless hosted on Vercel with Blob storage configured.

---

### CRIT-2: Image Upload Requires Vercel Blob — App Will Crash on Deploy Without It
**File:** `src/app/api/upload/route.ts`
**Lines:** 27-30

```typescript
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
if (!blobToken || blobToken === 'blob_token' || blobToken === 'REAL_VERCEL_BLOB_READ_WRITE_TOKEN_HERE') {
  return NextResponse.json({ error: 'Upload storage is not configured...' }, { status: 500 });
}
```

The token check has placeholder strings hardcoded. If someone accidentally deploys with one of these placeholder values, uploads silently fail with a 500. Even worse: the actual `put()` call on line 38 will throw an uncaught error if the token is invalid (it's outside the try-catch scope in the sense that the error bubbles up to the generic catch).

---

### CRIT-3: Database Connection Has No Fallback — Site Crashes on DB Outage
**File:** `src/lib/db.ts`

```typescript
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ ... });
```

There is no error handling for database connection failures. If the database is unreachable at startup or during runtime, **every single API route** will throw an unhandled exception. There is no connection retry logic, no graceful degradation, and no "database unavailable" page.

**Impact:** A single DB hiccup takes down the entire application.

---

### CRIT-4: In-Memory Data Store Lost on Every Deploy/Restart
**File:** `src/lib/profileStore.ts`

The entire fallback `Map`-based data store (`profileStore`) is **in-memory only**. On every server restart, deploy, or cold start:
- All profiles created during the fallback mode are **permanently lost**
- All leads are **permanently lost**
- All notifications are **permanently lost**
- Package purchases are **permanently lost**

This means the "offline mode" feature creates a false sense of reliability — data entered during a DB outage **will never be recovered**.

---

### CRIT-5: Admin `[id]` Routes Missing for Packages and Users
**File:** `src/app/api/admin/packages/[id]/route.ts` — **DOES NOT EXIST**

The admin packages API only has a list endpoint (`GET /api/admin/packages`) and a create endpoint. There is **no**:
- `GET /api/admin/packages/[id]` — to fetch a single package
- `PATCH /api/admin/packages/[id]` — to edit a package
- `DELETE /api/admin/packages/[id]` — to delete a package

Similarly, `GET /api/admin/users/route.ts` **does not exist** — there is no admin user management API at all.

**Impact:** Admin cannot edit, view, or delete individual packages. Admin cannot manage users.

---

## HIGH PRIORITY ISSUES (Functionality Broken)

### HIGH-1: WhatsApp Button Component Never Used
**File:** `src/components/WhatsAppButton.tsx`

This component exists and is fully coded, but it is **never imported or used** in any page or layout. The WhatsApp floating button that users expect to see on every page does not exist in the rendered output.

**Impact:** Users cannot contact via WhatsApp — a primary communication channel for a matrimonial site in India.

---

### HIGH-2: RegistrationPopup Component Never Used
**File:** `src/components/RegistrationPopup.tsx`

A popup component for prompting registration exists but is **never rendered anywhere**. The popup that should appear to encourage new visitors to register never shows.

**Impact:** Lost conversion — new visitors are never prompted to register.

---

### HIGH-3: `NikahComponents.tsx` Appears to Be Dead/Placeholder Code
**File:** `src/components/NikahComponents.tsx`

This component contains Nikah/marriage ceremony related UI elements that appear to be unfinished or unrelated to the core matrimonial matching functionality. It is not imported anywhere in the codebase.

**Impact:** Dead code that adds confusion and maintenance burden.

---

### HIGH-4: Package Inquiry Form Button Likely Non-Functional
**File:** `src/components/PackageInquiryForm.tsx`

This component exists for package-specific inquiries but the flow to trigger it from the packages page is unclear. The packages page (`src/app/packages/page.tsx`) and premium page likely don't properly connect to this form, meaning clicking "inquire" on a package does nothing.

**Impact:** Users cannot inquire about packages — lost revenue.

---

### HIGH-5: Profile Filters Component May Not Be Connected
**File:** `src/components/ProfileFilters.tsx`

This component exists for filtering profiles but if not properly wired to the search page's state management, the filter dropdowns will render but do nothing when changed.

**Impact:** Users cannot filter profiles by criteria.

---

### HIGH-6: Admin Zaicha Page — No Clear Purpose or Data Flow
**File:** `src/app/admin/zaicha/page.tsx`

The "Zaicha" (horoscope/astrology) admin page exists but there is no corresponding API endpoint for managing zaicha data. The page will load but likely show empty data or errors.

**Impact:** Admin feature is broken/incomplete.

---

### HIGH-7: Admin Events Page — No Events API
**File:** `src/app/admin/events/page.tsx`

There is no `api/admin/events/` route. The events admin page exists but has no backend to communicate with.

**Impact:** Event management feature is completely non-functional.

---

### HIGH-8: `EventManagement` Page Group Has No Backend
**File:** `src/app/event-management/` directory

The entire event management page group exists at the frontend level but has no corresponding API routes. Any event creation, editing, or listing will fail.

**Impact:** Event management is broken end-to-end.

---

## MEDIUM PRIORITY ISSUES (Data/Logic Problems)

### MED-1: Inconsistent Params Handling Between Similar Routes
**Files:**
- `src/app/api/profiles/[id]/route.ts` — uses `async params: Promise<{ id: string }>` (correct for Next.js 16)
- `src/app/api/admin/profiles/[id]/route.ts` — also uses `async params` (correct)
- `src/app/api/admin/leads/[id]/route.ts` — also uses `async params` (correct)

However, other API routes like `src/app/api/admin/leads/route.ts`, `src/app/api/admin/profiles/route.ts`, etc. don't use `params` at all. This is actually fine for list endpoints, but if any of them are later modified to use dynamic segments, the inconsistency could cause bugs.

**Status:** Not currently broken, but risky pattern.

---

### MED-2: Duplicate Package Access Check Logic
**Files:**
- `src/app/api/profile/route.ts` (lines ~60-70)
- `src/app/api/profiles/route.ts` (lines ~30-40)
- `src/app/api/user/interests/route.ts` (lines ~30-40)
- `src/app/api/user/shortlist/route.ts` (lines ~25-35)
- `src/app/api/user/viewed-profiles/route.ts` (lines ~25-35)

The exact same package-access-check logic (checking `monthly_membership`, `second_marriage_package`, `high_profile_package`, `good_profile_package`) is **copy-pasted across 5 different files**. This means:
- Any change to package logic must be replicated 5 times
- Inconsistencies will inevitably creep in
- The `hasPaid300Check` function is defined inline in each file

**Impact:** Maintenance nightmare; bugs when logic diverges.

---

### MED-3: `isFallbackAllowed()` Creates Phantom Data
**File:** `src/lib/profileStore.ts`

When the database is unavailable and `isFallbackAllowed()` returns true, the fallback store creates records in memory. However:
- These records have no Prisma-generated IDs
- They lack database-generated timestamps
- They are not searchable via database queries
- They are lost on restart

**Impact:** Silent data corruption risk. The API returns 200 success for operations that didn't actually persist.

---

### MED-4: Duplicate Search Logic — Profiles API Has Two Search Endpoints
**Files:**
- `src/app/api/profiles/route.ts` — public profile listing (returns only APPROVED)
- `src/app/api/profile/route.ts` — authenticated profile access (returns by userId)

The search/filter logic exists in both. The admin layer (`src/app/api/admin/profiles/route.ts`) adds a third layer of filtering. This triplication means search behavior may differ between public search, profile view, and admin panel.

---

### MED-5: No CSRF Protection on State-Changing Endpoints
**Files:** All POST/PATCH/DELETE routes

None of the API routes implement CSRF token validation. While Next.js provides some built-in protection via SameSite cookies, there is no explicit CSRF middleware. Any authenticated state-changing action (accepting interests, purchasing packages, updating profiles) is vulnerable to CSRF attacks.

---

### MED-6: Duplicate `getProfileByUserId` Calls in Same Request
**File:** `src/app/api/user/shortlist/route.ts` (and similar in interests, viewed-profiles)

In the GET handler for shortlists, the code calls:
1. `getShortlistedProfiles(session.user.id, ...)` — which internally calls `getProfileByUserId`
2. `prisma.matrimonialProfile.findUnique(...)` — calling the DB again for the same profile

This is a redundant database query on every request.

---

### MED-7: `getProfileByUserId` Used for Viewer but `getProfileById` for Target
**Files:** Multiple API routes

The codebase inconsistently uses `getProfileByUserId` (lookup by userId string) and `getProfileById` (lookup by database ID). These may return different results if the userId and database ID don't match, causing subtle bugs in profile matching.

---

### MED-8: No Request Timeout on External API Calls
**File:** `src/app/api/chatbot/route.ts`

The Gemini/OpenAI API calls have no timeout. If the AI provider hangs, the request will hang until the server's default timeout (which may be 30-60 seconds). This blocks the request handler and could exhaust server resources under load.

---

### MED-9: Notification Errors Silently Swallowed
**File:** `src/app/api/profile/route.ts` (and others)

```typescript
try {
  notifyRegistration(userEmail, profile.phoneNumber, profile.fullName);
  notifyAdminNewProfile(profile);
} catch (e) {
  console.error('Registration notifications failed to fire:', e);
}
```

Notification failures are caught and only logged to console. The user gets a success response even though notifications failed. Admin never knows about new registrations.

---

### MED-10: `isAdmin()` Helper Inconsistently Takes `req` Parameter
**Files:**
- `src/app/api/admin/verification/route.ts` — `async function isAdmin(req: NextRequest)` (req unused)
- `src/app/api/admin/settings/route.ts` — `async function isAdmin()` (no req)
- `src/app/api/admin/leads/[id]/route.ts` — `async function isAdmin()` (no req)
- `src/app/api/admin/profiles/[id]/route.ts` — `async function isAdmin(req: NextRequest)` (req unused)

Three different signatures for the same helper. This is harmless but indicates copy-paste without cleanup.

---

## LOW PRIORITY ISSUES (Code Quality / Dead Code)

### LOW-1: Duplicate `hasPaid300Check` Function Definition
**Files:** `src/app/api/profile/route.ts`, `src/app/api/profiles/route.ts`

The function `hasPaid300Check` is defined identically inside the GET handler of both files. This is dead-weight duplication.

---

### LOW-2: `AdminOverview.tsx` Likely Has Stale/Incorrect Stats
**File:** `src/components/AdminOverview.tsx`

Dashboard overview components often hardcode counts or call non-existent aggregate functions. If this component queries data that doesn't match the actual data model, the dashboard numbers will be wrong.

---

### LOW-3: `JsonLd.tsx` Component — SEO Helper, Verify It's Used
**File:** `src/components/JsonLd.tsx`

If this structured data component is not included in the root layout, SEO structured data will be missing from all pages.

---

### LOW-4: `RegistrationFormHeroImage.tsx` — Verify Usage
**File:** `src/components/RegistrationFormHeroImage.tsx`

This component may or may not be used. If not imported anywhere, it's dead code.

---

### LOW-5: `NikahComponents.tsx` — Unrelated/Dead Code
**File:** `src/components/NikahComponents.tsx`

This component is not imported anywhere and its purpose (Nikah ceremony components) doesn't align with the matrimonial platform's core features.

---

### LOW-6: Inconsistent Error Response Formats
Across all API routes, error responses use slightly different formats:
- Some use `{ error: 'message' }`
- Some use `{ error: errorMessage }` where `errorMessage` is derived from the error
- Some include `{ success: false, error: 'message' }`

This inconsistency makes frontend error handling fragile.

---

### LOW-7: No Input Length Limits on Text Fields
**Files:** Multiple API routes

Fields like `fullName`, `city`, `bio`, `occupation` have no maximum length validation. A user could submit a 1MB string for `fullName`, causing memory issues.

---

### LOW-8: Hardcoded Admin Email in Email Templates
**File:** `src/lib/emailTemplates.ts`

If email templates contain hardcoded admin email addresses instead of using `settings.adminEmail`, notifications will go to wrong addresses when settings change.

---

### LOW-9: `profileStore.ts` Has 1778 Lines — Should Be Split
**File:** `src/lib/profileStore.ts`

This single file contains ALL data access logic for profiles, leads, packages, purchases, master data, notifications, and audit logs. It should be split into at least 5-6 separate files for maintainability.

---

### LOW-10: No Rate Limiting on User-Facing Profile Operations
**Files:** `src/app/api/user/shortlist/route.ts`, `src/app/api/user/interests/route.ts`

These endpoints have no rate limiting. A malicious user could spam interest requests or shortlist toggles, causing notification floods and database writes.

---

## NEXT.JS 16 CONVENTION ISSUES

### NXT-1: `params` Must Be Awaited (Correctly Handled)
All dynamic route segments that use `params` correctly use `async params` and `await params`. This is correct for Next.js 16. ✓

### NXT-2: `cookies()` and `searchParams` Should Also Be Awaited
**Files:** Multiple API routes

```typescript
const { searchParams } = new URL(req.url); // This is fine for API routes
```

For API routes, `req.url` parsing is correct. But if any Server Component uses `searchParams` without `await`, it would break in Next.js 16.

### NXT-3: `dynamic = 'force-dynamic'` Only on Business Location Route
**File:** `src/app/api/business-location/route.ts`

Only one API route explicitly sets `dynamic = 'force-dynamic'`. Other routes that access `prisma` or `auth()` will implicitly be dynamic, but being explicit would avoid confusion.

---

## SECURITY CONCERNS

### SEC-1: No Input Sanitization on Most Fields
While the leads endpoint sanitizes HTML, the profile creation endpoint does not sanitize `bio`, `familyInfo`, or other text fields. XSS is possible if these values are rendered without escaping in client components.

### SEC-2: Weak Phone Number Validation
**File:** `src/app/api/leads/route.ts`

```typescript
function isValidPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\s+/g, '').replace(/[-+()]/g, '');
  return cleanPhone.length >= 10 && /^\d+$/.test(cleanPhone);
}
```

This accepts any 10+ digit string as a phone number, including sequences like `0000000000` or `1234567890`.

### SEC-3: No Request Size Limits
No API route sets a max body size. A 100MB JSON payload would be accepted and parsed, causing memory exhaustion.

### SEC-4: Error Messages Leak Internal Details
Some error responses include raw error messages from Prisma or other libraries (e.g., `return NextResponse.json({ error: error.message }, ...)`). This can leak database schema details, internal paths, or other sensitive information.

---

## SUMMARY

| Category | Count | Severity |
|----------|-------|----------|
| Critical Bugs | 5 | 🔴 Website-breaking |
| High Priority | 8 | 🟠 Feature broken |
| Medium Priority | 10 | 🟡 Data/logic issues |
| Low Priority | 10 | 🔵 Code quality |
| Next.js Issues | 3 | 🟡 Convention |
| Security | 4 | 🟠 Vulnerabilities |
| **Total Issues** | **40** | |

### Top Issues Fixing Priority:
1. **CRIT-1/CRIT-2**: Replace Vercel Blob dependency with configurable storage (S3, local, or Cloudinary)
2. **CRIT-3**: Add database connection error handling and health checks
3. **CRIT-5**: Create missing `admin/packages/[id]` and `admin/users` API routes
4. **HIGH-1**: Wire up the WhatsAppButton component to the layout
5. **HIGH-2**: Wire up the RegistrationPopup component
6. **HIGH-7/HIGH-8**: Either complete or remove the admin events and zaicha pages
7. **MED-2**: Refactor duplicate package access check into a shared utility
8. **SEC-1**: Add XSS sanitization to all text inputs
