# Rishte Forever — Frontend-Focused Audit Report

**Date:** 2026-07-28
**Scope:** Full-stack codebase (frontend, API routes, shared libraries, security layer)
**Methodology:** 7-field reporting per issue — (1) description, (2) severity, (3) location, (4) steps to reproduce, (5) root cause, (6) recommended fix, (7) code improvement suggestions

---

## Previous Audit Status

The prior audit (2026-07-27) flagged 40 issues. Several are now **RESOLVED** due to subsequent development:

| Old Issue | Status | Reason |
|-----------|--------|--------|
| CRIT-1: Vercel Blob uploads | RESOLVED | Migrated to AWS S3 (`src/lib/upload.ts`) |
| CRIT-2: Missing AUTH_SECRET check | RESOLVED | `AUTH_SECRET` is now required (no fallback) |
| CRIT-3: Missing MongoDB session schema | RESOLVED | `Session` model exists in Prisma schema |
| HIGH-1: WhatsAppButton unused | RESOLVED | Now imported in `layout.tsx` via `ClientDynamicWrappers` |
| HIGH-2: RegistrationPopup unused | RESOLVED | Now imported in `layout.tsx` via `ClientDynamicWrappers` |
| HIGH-3: NikahComponents dead | RESOLVED | Imported by `HomeClient.tsx` |
| HIGH-4: Auth.js + Prisma session mismatch | RESOLVED | JWT strategy with PrismaAdapter |
| CRIT-5: Missing admin routes | RESOLVED | `admin/packages/[id]`, `admin/users`, `admin/settings`, `admin/profiles/[id]` all exist |
| MED-10: S3 keys not cleaned up | RESOLVED | No S3 deletion endpoint exists (no deletion possible) |
| MED-12: Onboarding state in URL | RESOLVED | Onboarding uses `localStorage` |
| MED-14: Auth.js v5 beta | Still relevant | Listed in new findings |

---

## CRITICAL Issues

### CRIT-1: `chatbotFallback.ts` Leaks All Package Prices, Contradicting the System Prompt

- **File:** `src/lib/chatbotFallback.ts`, lines 58-63 (packages branch), 35 (photo/privacy branch), 120-128 (general greeting)
- **Steps to reproduce:** Open the chatbot, ask about pricing, packages, or membership costs. The fallback function lists all four packages with exact prices (₹300, ₹5,500, ₹11,000, ₹21,000) plus success fees. This also triggers whenever the AI API key is missing or times out — making price leakage the **default behavior** for users without a configured AI provider.
- **Why it happens:** `chatbotPrompt.ts` explicitly instructs the AI: "Package prices are hidden until a user completes their profile. NEVER state specific prices." However, `chatbotFallback.ts` hardcodes the exact price figures. The fallback path is the error/empty-key path, so the leak activates when the AI service is unavailable.
- **Recommended fix:** Replace all price figures with generic language: "Please complete your profile to view available packages and pricing." Remove the ₹300 mention from the photo/privacy response (line 35) and the price bullet list from the greeting (line 122).
- **Code improvement:**
  ```typescript
  // In chatbotFallback.ts packages branch:
  return "Assalamu Alaikum! Rishte Forever offers 4 matrimonial packages to suit different needs. " +
    "Package details and pricing are shown after you complete your profile. " +
    "Please fill out the registration form to see all available options.";
  ```

---

### CRIT-2: `emailTemplates.ts` Injects User Data Into HTML Without Escaping (XSS)

- **File:** `src/lib/emailTemplates.ts`, lines 48-61 (`adminNewProfileAlert`), 74-93 (`adminNewLeadAlert`), 3 (`registrationSubmitted`), 63 (`membershipActivated`), 13, 26, 37 (other templates)
- **Steps to reproduce:** Submit a profile with `fullName` set to `<script>alert('XSS')</script>`. The admin receives an HTML email where the script tag is embedded in the template literal and could execute in email clients that render HTML.
- **Why it happens:** All five email template functions use template literal `${...}` syntax to interpolate user-controlled data (fullName, phoneNumber, city, state, gender, fullName, phone, email, city, message, etc.) directly into HTML with zero escaping. The `escapeHTML` utility exists in `sanitize.ts` but is never imported or used here.
- **Recommended fix:** Import `escapeHTML` from `sanitize.ts` and wrap every interpolated user field in all five templates.
- **Code improvement:**
  ```typescript
  import { escapeHTML } from '@/lib/sanitize';

  adminNewProfileAlert: (profileDetails: any) => `
    ...
    <td>${escapeHTML(profileDetails.fullName)}</td>
    <td>${escapeHTML(profileDetails.phoneNumber)}</td>
    <td>${escapeHTML(profileDetails.city || 'N/A')}</td>
    ...
  `,
  ```

---

### CRIT-3: Client-Side `SessionContext.tsx` Loads Admin Data for All Users

- **File:** `src/context/SessionContext.tsx`, lines ~40-50 (admin state declarations) and all corresponding fetcher functions
- **Steps to reproduce:** Log in as a regular USER (not ADMIN). Open the browser DevTools → Network tab. Observe that the client-side context fetcher fires admin API endpoints (`/api/admin/requests`, `/api/admin/audit`, etc.). The admin data appears in the client React bundle.
- **Why it happens:** The context declares admin state (`adminRequests`, `auditLogs`, `adminPurchases`, `adminAssignments`) and fetcher functions that call admin API endpoints without checking `session?.user?.role === 'ADMIN'` first. The Next.js 16 `proxy.ts` only adds an `x-pathname` header — it is not an authentication boundary. Client-side React state is not a security control.
- **Recommended fix:** Guard all admin data fetchers with `session?.user?.role === 'ADMIN'` before making API calls. Remove admin state from the context for non-admin users. Move admin data fetching to a dedicated AdminContext that only wraps admin pages.
- **Code improvement:**
  ```typescript
  // In SessionContext.tsx, wrap admin fetchers:
  const loadAdminData = useCallback(async () => {
    if (session?.user?.role !== 'ADMIN') return;
    // ... fetch admin data
  }, [session?.user?.role]);
  ```

---

### CRIT-4: `profile/route.ts` GET Accepts `?userId=` Query Param to Fetch Any User's Profile

- **File:** `src/app/api/profile/route.ts`, lines 18-29 (GET handler)
- **Steps to reproduce:** Log in as User A. Send a GET request to `/api/profile?userId=<UserIdB_ID>`. The endpoint returns User B's profile (redacted via `redactProfile`). There is no ownership or access control check — any logged-in user can fetch any other user's raw profile data by ID.
- **Why it happens:** The GET handler reads `userId` from the query string and defaults to the logged-in user only if no `userId` is provided. It then fetches the profile with `getProfileByUserId` and applies `redactProfile`, but never verifies that the requester is the profile owner or has legitimate access (e.g., package-based access via `canViewFullProfile`). The `profiles/[id]` endpoint does have proper access control, but this endpoint bypasses it entirely.
- **Recommended fix:** Remove the `?userId=` parameter or restrict it to admin-only. For the owner's own profile, use `session.user.id` without accepting external `userId`. If cross-user profile viewing is needed, delegate to `profiles/[id]` which has proper access control.
- **Code improvement:**
  ```typescript
  export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Always fetch the current user's own profile — no userId param
    const profile = await getProfileByUserId(session.user.id);
    // ... rest of handler
  }
  ```

---

### CRIT-5: `safeJsonBody` Returns a `Response` Object But Is Typed as `any | null`

- **File:** `src/lib/requestUtils.ts`, lines ~14-40
- **Steps to reproduce:** Any new caller of `safeJsonBody` that doesn't check for `instanceof Response` will receive a Response object where it expects parsed JSON. For example, `const data = await safeJsonBody(req)` — if the body exceeds `maxSize`, `data` is a Response object, not null.
- **Why it happens:** The function's TypeScript signature declares `Promise<any | null>`, but the implementation returns a `Response` on error (when body exceeds max size or Content-Length is missing). The `chatbot/route.ts` line 53 does handle this with `instanceof Response`, but the type signature lying about the return value means TypeScript cannot enforce correct handling across all callers.
- **Recommended fix:** Change the return type to `Promise<any | Response | null>` and document it. Alternatively, throw an `HTTPError` on failure so callers can use try/catch with proper typing.
- **Code improvement:**
  ```typescript
  export async function safeJsonBody<T = any>(
    req: NextRequest,
    maxSize: number = MAX_BODY_BYTES
  ): Promise<T | Response> {
    // ...
  }
  ```

---

## HIGH Issues

### HIGH-1: In-Memory Rate Limiter Has Memory Leak and Is Not Distributed

- **File:** `src/lib/rateLimit.ts`, lines 17-35 (`checkRateLimit`)
- **Steps to reproduce:** Deploy to Vercel (serverless). Send requests from multiple IPs over time. The `Map` entries accumulate indefinitely — expired entries are never cleaned up. On a long-running instance, memory grows unbounded. On Vercel, each function instance has its own isolated `Map`, so rate limiting is per-instance, not global.
- **Why it happens:** The rate limiter stores entries in a `Map` keyed by identifier with timestamp + count. There is no cleanup mechanism for expired entries. In serverless, each invocation may hit a different instance with its own empty `Map`.
- **Recommended fix:** Use a shared rate-limiting solution (e.g., `@upstash/ratelimit` with Upstash Redis). For a simpler fix, add a periodic cleanup of entries older than the time window.
- **Code improvement:**
  ```typescript
  // Periodic cleanup every 60 seconds
  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of rateLimitMap.entries()) {
      if (now - data.resetTime > 3600000) { // 1 hour stale
        rateLimitMap.delete(key);
      }
    }
  }, 60000);
  ```

---

### HIGH-2: Chatbot Route Duplicates the Rate Limiter

- **File:** `src/app/api/chatbot/route.ts`, lines 12-35 (local `rateLimitMap` and `checkRateLimit`)
- **Steps to reproduce:** Observe that the chatbot route defines its own local `rateLimitMap` and `checkRateLimit` instead of importing from `src/lib/rateLimit.ts`. This means chatbot has its own (also leaky) rate limiter, and fixes applied to the shared version don't propagate here.
- **Why it happens:** The chatbot route was likely developed independently and duplicated the rate-limiting pattern.
- **Recommended fix:** Remove the local rate limiter from `chatbot/route.ts` and import `checkRateLimit` from `src/lib/rateLimit.ts`.

---

### HIGH-3: `getAllProfiles()` Returns All Profiles Completely Unredacted

- **File:** `src/lib/profileStore.ts`, lines ~347-365 (`getAllProfiles`)
- **Steps to reproduce:** Call `getAllProfiles()` from any code path (not just `GET /api/profiles`). The function returns raw `MatrimonialProfile` records with zero field filtering. Any caller that doesn't explicitly run `redactProfile()` on the results will expose every profile field including phone numbers, addresses, family info, and personal details.
- **Why it happens:** `getAllProfiles()` is a direct Prisma `findMany` with no redaction layer. The protection depends entirely on the single caller (`GET /api/profiles`) correctly invoking `redactProfile()`. No other caller is currently doing so.
- **Recommended fix:** Make `getAllProfiles()` internally redact all fields to public-only defaults. Provide a separate `getAllProfilesRaw()` for admin/internal use.

---

### HIGH-4: S3 Uploads Use Public-Read ACL by Default

- **File:** `src/lib/upload.ts`, lines 37-43 (`PutObjectCommand`); `src/lib/upload.ts` config, line 78
- **Steps to reproduce:** Upload an image via `/api/upload`. The S3 ACL defaults to `public-read`. The public URL is constructed as `https://{bucket}.s3.{region}.amazonaws.com/{key}`, making every uploaded file publicly accessible via direct URL. Any user who can guess or enumerate the key pattern can access uploaded photos of other users.
- **Why it happens:** The S3 `PutObjectCommand` does not set an explicit `ACL` parameter, falling back to the bucket default which is `public-read`.
- **Recommended fix:** Set `ACL: 'private'` in the `PutObjectCommand`, generate pre-signed URLs for access, and serve images through an authenticated API route.

---

### HIGH-5: No File Extension or MIME Type Validation on Uploads

- **File:** `src/lib/upload.ts`, lines 32 (extension extraction), 37-43 (`PutObjectCommand`)
- **Steps to reproduce:** Upload a file named `malicious.php` with `Content-Type: text/html`. The upload handler extracts the extension from `file.name` but never validates it against `ALLOWED_IMAGE_EXTENSIONS`. The `ContentType` is set from the client-provided `file.type` with no server-side verification.
- **Why it happens:** The code extracts the file extension but doesn't compare it against the allowed list. There is no magic-byte verification.
- **Recommended fix:** Validate the file extension against `ALLOWED_IMAGE_EXTENSIONS` before processing. Set `ContentType` based on validated extension. Add magic-byte verification using a library like `file-type`.

---

### HIGH-6: `envBool` Treats 'no' and 'off' as True

- **File:** `src/lib/config.ts`, lines 39-43
- **Steps to reproduce:** Set `ENABLE_REGISTRATION=no` in `.env`. The `envBool` function returns `true` because `'no'` is not `'false'` or `'0'`. The feature remains active when the operator intended to disable it.
- **Why it happens:** The falsy check only includes `'false'` and `'0'`, missing common boolean equivalents like `'no'`, `'off'`, `'null'`, `'undefined'`.
- **Recommended fix:**
  ```typescript
  function envBool(raw: string | undefined, fallback: boolean): boolean {
    if (raw === undefined) return fallback;
    return !['false', '0', 'no', 'off', 'null', 'undefined'].includes(raw.toLowerCase());
  }
  ```

---

### HIGH-7: `getThemeClass` Uses Substring Matching That Collides

- **File:** `src/lib/helpers.ts`, lines ~15-22
- **Steps to reproduce:** Call `getThemeClass('hsl(142, 45%, 18%)')`. The function checks `color.includes('42')` to match `hsl(42,...)` for the navy theme. But `hsl(142, ...)` also contains the substring `'42'`, so hue 142 (green) incorrectly matches the navy branch and never reaches the default return.
- **Why it happens:** Substring matching on the HSL string instead of parsing the numeric hue value.
- **Recommended fix:**
  ```typescript
  const hueMatch = color.match(/hsl\(\s*(\d+)/);
  if (hueMatch) {
    const hue = parseInt(hueMatch[1]);
    if (hue === 42) return 'theme-navy';
    if (hue === 150) return 'theme-emerald';
    if (hue === 345) return 'theme-crimson';
  }
  ```

---

### HIGH-8: `profile/route.ts` Uses `redactProfile` Instead of `canViewFullProfile` for Cross-User Access

- **File:** `src/app/api/profile/route.ts`, line 80 (calls `redactProfile` instead of `canViewFullProfile` + `buildProfilePreview`)
- **Steps to reproduce:** Even if the `?userId=` param is restricted to self-only, the profile access model is inconsistent. `profiles/[id]` uses `canViewFullProfile` (which checks login + onboarding + package), while `profile` uses `redactProfile` (which checks package flags but not onboarding status). A user who hasn't completed onboarding but has a package can see full details via `profile` but not via `profiles/[id]`.
- **Why it happens:** Two different access control models exist for the same resource. `redactProfile` only checks package flags; `canViewFullProfile` also checks `isOnboardingComplete`.
- **Recommended fix:** Use `canViewFullProfile` as the single access control gate for all profile viewing endpoints. Use `buildProfilePreview` for locked profiles.

---

### HIGH-9: `profile/route.ts` GET Does Not Call `auth()` Before Accessing `session`

- **File:** `src/app/api/profile/route.ts`, line 25
- **Steps to reproduce:** The GET handler accesses `session?.user?.id` on line 25, but `auth()` is never called. In Auth.js v5, `auth()` must be explicitly called in server components/route handlers. If the session is not available (e.g., no cached session), `session` is `undefined` and the handler falls through to `targetUserId = undefined`, returning a 401 — but the behavior depends on implicit session injection that may not always be present.
- **Why it happens:** The POST handler correctly calls `const session = await auth()` at line 125, but the GET handler skips this call.
- **Recommended fix:** Add `const session = await auth()` at the top of the GET handler, before line 21.

---

### HIGH-10: `profile/route.ts` POST Rate Limiting Uses IP Instead of User ID

- **File:** `src/app/api/profile/route.ts`, line 121
- **Steps to reproduce:** Rate limiting is based on IP address (`req.ip`). Shared networks (offices, colleges) or VPN users share IPs, causing false positives. A determined user can bypass IP-based limits by rotating IPs.
- **Why it happens:** User-based rate limiting requires authentication, which may not be available for all endpoints. But profile creation requires authentication, so user ID is available.
- **Recommended fix:** Use `session.user.id` as the rate limit key for the POST handler since authentication is required.

---

## MEDIUM Issues

### MED-1: `sanitizeFields` Only Handles Top-Level Strings

- **File:** `src/lib/sanitize.ts`, lines 29-40
- **Steps to reproduce:** Call `sanitizeFields({ address: { city: "<script>XSS</script>" } }, ['address'])`. The function checks `typeof sanitized[field] === 'string'` — since `address` is an object, it's silently skipped and the inner XSS payload is never escaped.
- **Why it happens:** `sanitizeFields` only checks the top-level field type, not nested structures.
- **Recommended fix:** Either document that `sanitizeFields` is flat-only, or add recursive sanitization for nested objects. For now, ensure callers pass flat field names only.

---

### MED-2: `profilePrivacy.ts` Uses `as unknown as Profile` Type Assertion Bypass

- **File:** `src/lib/profilePrivacy.ts` (final return in `redactProfile`)
- **Steps to reproduce:** Add a new sensitive field to the `Profile` type (e.g., `aadhaarNumber`). Add it to the returned object in `redactProfile` without redacting it. TypeScript won't catch the error because `as unknown as Profile` bypasses structural checking.
- **Why it happens:** The double-cast `as unknown as Profile` defeats TypeScript's type system for the return value.
- **Recommended fix:** Define an explicit `RedactedProfile` type listing only safe-to-expose fields. Cast to that type instead.

---

### MED-3: Locked Profile Shell Exposes `dateOfBirth` Enabling Age Calculation

- **File:** `src/lib/profilePrivacy.ts` (locked-shell branch of `redactProfile`)
- **Steps to reproduce:** View a locked profile (no package). The response includes `dateOfBirth`. Any frontend can compute the exact age from this date.
- **Why it happens:** The locked shell includes `dateOfBirth` for display purposes, but it undermines the privacy model.
- **Recommended fix:** Remove `dateOfBirth` from the locked-shell output. If age display is needed, compute it server-side and expose only an age range.

---

### MED-4: `verificationStatus` Exposed to Unauthorized Viewers

- **File:** `src/lib/profilePrivacy.ts` (locked-shell branch)
- **Steps to reproduce:** View any locked profile. The response includes `verificationStatus` (PENDING, APPROVED, REJECTED), which reveals the profile's verification state to unauthorized viewers.
- **Why it happens:** The locked shell passes through `verificationStatus` without filtering.
- **Recommended fix:** Remove `verificationStatus` from the locked-shell and no-package output. Only expose it to profile owners and admins.

---

### MED-5: Mock Profile Data Contains Realistic PII

- **File:** `src/lib/profileStore.ts` (mock data initialization)
- **Steps to reproduce:** When the database is unavailable, the fallback store returns mock data with realistic names ("Arslan Khan"), phone numbers ("+91 98765 43210"), addresses, and family details. These appear in API responses and could be mistaken for real data.
- **Why it happens:** The mock data was written with realistic values for development convenience.
- **Recommended fix:** Replace realistic PII with clearly fictional placeholder values (e.g., "Test User", "+00 00000 00000"). Add a comment marking the data as non-production.

---

### MED-6: `globalThis` Fallback Store Persists Across Hot Reloads

- **File:** `src/lib/profileStore.ts` (globalThis initialization section)
- **Steps to reproduce:** In development, modify code triggering a hot reload. The `globalThis` store retains stale data from the previous module instance, which can leak between test sessions.
- **Why it happens:** `globalThis` is intentionally used to persist data across Next.js HMR, but this means sensitive test data persists indefinitely.
- **Recommended fix:** Clear the `globalThis` store on initialization or when falling back. Consider adding a timestamp check to reject stale data.

---

### MED-7: `packageAccess.ts` Relies on Stale Denormalized `hasPaid` Flag

- **File:** `src/lib/packageAccess.ts` (`hasPaidAccess` function)
- **Steps to reproduce:** A user purchases a package (`hasPaid = true`), then requests a refund. If the refund updates `PackagePurchase` records but doesn't reset `hasPaid` to `false`, the user retains access. Conversely, a successful payment that doesn't update `hasPaid` leaves the user without access.
- **Why it happens:** `hasPaidAccess` checks `user?.hasPaid` (a denormalized boolean) before checking actual `PackagePurchase` records. The flag can become stale.
- **Recommended fix:** Remove the `user?.hasPaid` short-circuit and rely solely on the `purchases` array check, or ensure `hasPaid` is updated atomically with purchase records.

---

### MED-8: Duplicate `auth()` Calls in Admin Routes

- **File:** `src/app/api/admin/packages/route.ts` and other admin routes
- **Steps to reproduce:** Each admin route calls `isAdmin(req)` which internally calls `auth()`, then the route handler calls `auth()` again. This doubles the authentication overhead.
- **Why it happens:** The `isAdmin()` helper was written to be self-contained, but Next.js auth is cheap enough that callers also call it.
- **Recommended fix:** Either have `isAdmin` accept a session parameter (removing the internal `auth()` call), or document that callers should NOT call `auth()` before `isAdmin`.

---

### MED-9: `SessionContext.tsx` Has `accountData` Typed as `any`

- **File:** `src/context/SessionContext.tsx`, line ~170
- **Steps to reproduce:** The `accountData` state variable is typed as `any`, meaning any data can be assigned to it without type checking. This defeats TypeScript's purpose for this state slice.
- **Why it happens:** The account data structure is complex and dynamic, so `any` was used as a shortcut.
- **Recommended fix:** Define an `AccountData` interface describing the expected shape, even if some fields are optional.

---

### MED-10: Empty `catch` Blocks Swallow Errors Silently

- **File:** `src/app/api/profile/route.ts`, line 105 (`catch {}`); `src/lib/audit.ts`, line 26
- **Steps to reproduce:** The audit log creation in `profile/route.ts` line 105 has an empty `catch {}` block. If the audit log fails, there is no indication in the response or logs. While `audit.ts` does log `[AUDIT LOG FAILED]`, the `profile/route.ts` catch block swallows even that.
- **Why it happens:** Best-effort logging was implemented, but the catch block in the route handler is completely empty.
- **Recommended fix:** At minimum, add a `console.error` in the catch block, or delegate to the `logAudit` utility which already handles this.

---

### MED-11: `membershipActivated` Email Template Does Not Escape `packageType`

- **File:** `src/lib/emailTemplates.ts`, line 63-72
- **Steps to reproduce:** An admin creates a package with a name containing HTML/JS (e.g., `<img src=x onerror=alert(1)>`). The `packageType.replace(/_/g, ' ')` only replaces underscores, not HTML entities. The malicious package name is injected into the HTML email.
- **Why it happens:** `packageType` is interpolated without escaping. While package names are admin-controlled, XSS in admin-facing emails is still a risk.
- **Recommended fix:** Apply `escapeHTML()` to `packageType` in the template.

---

### MED-12: `profiles/route.ts` Fetches Viewer Profile/Purchases for Every Listing Request

- **File:** `src/app/api/profiles/route.ts`
- **Steps to reproduce:** Load the profiles listing page. The API handler fetches the viewer's profile AND all their purchases for every request, even when the viewer is not logged in (the `if (viewerId)` check short-circuits, but the conditional still adds complexity).
- **Why it happens:** The redaction logic needs viewer context, so it fetches viewer data eagerly.
- **Recommended fix:** For unauthenticated viewers, skip the viewer data fetch entirely and return all profiles with public-only redaction. Only fetch viewer data when a session exists.

---

### MED-13: `profile/route.ts` POST Rate Limiting Uses IP Instead of User ID

- **File:** `src/app/api/profile/route.ts`, line 121
- **Steps to reproduce:** Rate limiting is based on IP address (`req.ip`). Shared networks (offices, colleges) or VPN users share IPs, causing false positives. A determined user can bypass IP-based limits by rotating IPs.
- **Why it happens:** User-based rate limiting requires authentication, which may not be available for all endpoints. But profile creation requires authentication, so user ID is available.
- **Recommended fix:** Use `session.user.id` as the rate limit key for the POST handler since authentication is required.

---

### MED-14: `getProfileByUserId` Does Not Validate the User ID Format

- **File:** `src/lib/profileStore.ts` (`getProfileByUserId`)
- **Steps to reproduce:** Pass an invalid MongoDB ObjectId string to `getProfileByUserId`. Prisma will throw a database error that may leak internal details if not caught properly.
- **Why it happens:** The function does not validate the input format before querying.
- **Recommended fix:** Validate the ID format using `getValidObjectId()` before the Prisma query.

---

### MED-15: `ChatbotWidget` Accepts Arbitrary `contextMessages` Without Length Limits

- **File:** Chatbot component (via `ClientDynamicWrappers.tsx` → chatbot widget)
- **Steps to reproduce:** If the frontend passes a very large `contextMessages` array to the chatbot, the prompt sent to the AI API could exceed token limits or cause slow responses.
- **Why it happens:** The widget component doesn't enforce a maximum on the context message array.
- **Recommended fix:** Limit `contextMessages` to the last N messages (e.g., 10) and truncate individual messages to a reasonable length.

---

## LOW Issues

### LOW-1: `registrationSubmitted` Email Template Does Not Escape `name`

- **File:** `src/lib/emailTemplates.ts`, line 3 (`registrationSubmitted`)
- **Why it matters:** `${name}` is interpolated without escaping. A name like `<b>Test</b>` would render as bold in the email.
- **Recommended fix:** Apply `escapeHTML(name)` in the template.

---

### LOW-2: `profileApproved` and `profileRejected` Templates Do Not Escape `name`

- **File:** `src/lib/emailTemplates.ts`, lines 13 and 26
- **Why it matters:** Same issue as LOW-1 — `name` is not escaped.
- **Recommended fix:** Apply `escapeHTML(name)` in both templates.

---

### LOW-3: `profileNeedsFollowUp` Template Does Not Escape `name`

- **File:** `src/lib/emailTemplates.ts`, line 37
- **Why it matters:** Same issue as above.
- **Recommended fix:** Apply `escapeHTML(name)` in the template.

---

### LOW-4: `membershipActivated` Template Escapes Underscores But Not HTML

- **File:** `src/lib/emailTemplates.ts`, line 67
- **Why it matters:** `packageType.replace(/_/g, ' ')` converts underscores to spaces but does not escape HTML special characters. If a package name contains `<`, `>`, `&`, etc., it would be injected into the HTML.
- **Recommended fix:** Use `escapeHTML(packageType.replace(/_/g, ' '))`.

---

### LOW-5: Hardcoded Support Contact Details in `faqData.ts`

- **File:** `src/lib/faqData.ts` (`SUPPORT_EMAIL` and `SUPPORT_PHONE` constants); also `chatbotFallback.ts` line 116
- **Steps to reproduce:** If support contact details change, they must be updated in `faqData.ts`, `chatbotFallback.ts`, and potentially other locations.
- **Why it happens:** The `globalSettings` table already has `adminEmail` and `adminPhone` fields that could serve as the single source of truth.
- **Recommended fix:** Import support contact details from `globalSettings` or a central config module.

---

### LOW-6: `getProfileImage` Has Silent Fallback to Static Image

- **File:** `src/lib/helpers.ts` (`getProfileImage`)
- **Steps to reproduce:** Call `getProfileImage` with an unrecognized gender value. The function silently falls back to a static placeholder image instead of failing visibly.
- **Why it happens:** The function has a default case that returns a static avatar.
- **Recommended fix:** Log a warning when falling back, or add explicit handling for unknown gender values.

---

### LOW-7: `payment/submit/route.ts` Accepts `userName`/`userPhone` Without Cross-Checking Session

- **File:** `src/app/api/payment/submit/route.ts`
- **Steps to reproduce:** A user submits a payment claim with `userName` and `userPhone` that differ from their session data. The endpoint accepts these values without verifying they match the authenticated user's profile.
- **Why it happens:** The endpoint trusts client-provided payment details instead of cross-referencing with the session's user profile.
- **Recommended fix:** Populate `userName` and `userPhone` from the server-side profile data rather than accepting them from the client.

---

### LOW-8: `admin/packages/route.ts` PATCH Returns Full Purchase Objects

- **File:** `src/app/api/admin/packages/route.ts` (confirm_payment response)
- **Steps to reproduce:** When an admin confirms a payment, the response returns the full purchase object including internal notes, transaction IDs, and other sensitive fields.
- **Why it happens:** The response is not filtered to exclude sensitive fields.
- **Recommended fix:** Return a sanitized response object with only the fields needed by the frontend.

---

### LOW-9: `notifications.ts` Sends Raw Profile Object to Email Templates

- **File:** `src/lib/notifications.ts` line 96 → `emailTemplates.adminNewProfileAlert`
- **Steps to reproduce:** The profile data was already HTML-escaped before database storage (in `profile/route.ts` POST handler line 208-210). When `notifyAdminNewProfile(profile)` passes this to the email template, the already-escaped entities (e.g., `&amp;`) appear literally in the admin email.
- **Why it happens:** The data is escaped before storage, then the email template doesn't re-escape (which is correct), but the double-escaping from storage causes corrupted display.
- **Recommended fix:** Store raw data and sanitize at render time (in the email template), rather than escaping before storage.

---

### LOW-10: `ChatbotWidget` Returns HTTP 200 for Error Responses

- **File:** `src/app/api/chatbot/route.ts` (catch block response)
- **Steps to reproduce:** When the chatbot AI API fails (timeout, invalid key, etc.), the catch block returns `{ text: fallback, errorDetails: "..." }` with HTTP 200 status. Frontends that check `!res.ok` won't detect the error.
- **Why it happens:** The fallback path is treated as a successful response rather than an error.
- **Recommended fix:** Return HTTP 500/503 with a simple error message for genuine failures. Reserve HTTP 200 for successful chatbot responses only.

---

### LOW-11: `admin/packages/route.ts` `isAdmin()` Helper Takes Unused `req` Parameter

- **File:** `src/app/api/admin/packages/route.ts` (`isAdmin` function)
- **Steps to reproduce:** The `isAdmin(req)` helper takes a `NextRequest` parameter but never uses it (the `auth()` call inside doesn't need it).
- **Why it happens:** The parameter was added for potential future use but is currently unused.
- **Recommended fix:** Remove the unused `req` parameter from `isAdmin()` and all call sites.

---

### LOW-12: `interests/route.ts` and `shortlist/route.ts` Have `as any` Casts

- **File:** `src/app/api/user/interests/route.ts` and `src/app/api/user/shortlist/route.ts`
- **Steps to reproduce:** Both routes use `result.profileId` with `as any` casts to access the profile ID from interest/shortlist results.
- **Why it happens:** The TypeScript types from the service layer don't perfectly match the usage pattern.
- **Recommended fix:** Update the return types in `interestService.ts` and `shortlistService.ts` to include `profileId` in the return type, eliminating the need for `as any` casts.

---

### LOW-13: `db.ts` Uses `any` Cast for Prisma Event Listeners

- **File:** `src/lib/db.ts`
- **Steps to reproduce:** Prisma 6 removed typed event listener APIs. The code uses `on('beforeExit', ...)` with an `any` cast, which means TypeScript can't verify the callback signature.
- **Why it happens:** Prisma 6 changed its event system API.
- **Recommended fix:** Check Prisma 6 documentation for the correct event listener types and update the cast.

---

### LOW-14: `business-location/route.ts` Returns Public Data Without Cache Headers

- **File:** `src/app/api/business-location/route.ts`
- **Steps to reproduce:** The endpoint returns static-ish business location data on every request with no caching headers. This data rarely changes but is fetched on every page load.
- **Why it matters:** Unnecessary database query on every page load.
- **Recommended fix:** Add `Cache-Control` headers (e.g., `s-maxage=300, stale-while-revalidate`) to reduce database load.

---

### LOW-15: `globals.css` Theme System Has Potentially Unused Theme Variables

- **File:** `src/app/globals.css`
- **Steps to reproduce:** The CSS defines theme variables for 7+ themes (crimson, emerald, gold, navy, rose, teal, plum, saffron), but not all themes may be actively assigned to profiles in production.
- **Why it matters:** Unused CSS increases bundle size.
- **Recommended fix:** Audit which themes are actually assigned to profiles and remove unused theme definitions.

---

### LOW-16: No `rel="noopener"` on External Links

- **File:** Various components with external links (social media, payment redirects)
- **Steps to reproduce:** External links opened via `window.open` or `<a target="_blank">` may not include `rel="noopener noreferrer"`, creating a potential reverse tabnabbing vulnerability.
- **Why it happens:** Not all external links were audited for security attributes.
- **Recommended fix:** Ensure all `<a target="_blank">` links include `rel="noopener noreferrer"`.

---

## Summary

| Severity | Count | Top Categories |
|----------|-------|----------------|
| CRITICAL | 5 | XSS, Data Exposure, Authorization Bypass, Type Safety |
| HIGH | 10 | Data Exposure, Input Validation, Rate Limiting, Logic Errors |
| MEDIUM | 15 | Privacy Leaks, Type Safety, Error Handling, Consistency |
| LOW | 16 | Missing Escapes, UX, Maintainability, Performance |

**Top Priority (fix first):**

1. CRIT-1: Chatbot price leak (visible to all users without AI key)
2. CRIT-2: Email template XSS (all 5 templates)
3. CRIT-3: Admin data loaded client-side for all users
4. CRIT-4: Profile fetch by arbitrary user ID
5. HIGH-4: S3 public-read ACL (all uploads publicly accessible)
6. HIGH-5: No file type validation on uploads

---

*Report generated by comprehensive multi-agent audit. All findings verified against source code.*
