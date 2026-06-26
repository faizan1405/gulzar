import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Next.js 16 renamed `middleware` -> `proxy`. This runs only on /admin routes
// and forwards the request path UPSTREAM (via request headers) so the admin
// server-component layout can tell whether the current route is the login page
// and skip the auth gate for it (preventing a redirect loop).
//
// NOTE: headers must be passed through `NextResponse.next({ request: { headers } })`
// to reach Server Components — setting them on the response only exposes them to
// the browser, not to `headers()` during render.
export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};
