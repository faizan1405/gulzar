import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const simulatedAdmin = isDemoMode && req.headers.get('x-simulator-admin') === 'true';
  
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    const isAdmin = req.auth?.user?.role === 'ADMIN' || simulatedAdmin;
    if (!isAdmin) {
      return Response.redirect(new URL('/', nextUrl));
    }
  }
});

export const config = {
  // Matches all routes except static files, api routes, and images
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
