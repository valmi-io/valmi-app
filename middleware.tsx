import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { publicRoutes, isPublicSync } from '@utils/routes';
import { getAuthTokenCookie } from '@/lib/cookies';

export async function middleware(request: NextRequest) {
  let cookie = request.cookies.get(getAuthTokenCookie())?.value;
  const url = request.nextUrl.href;
  const parsedUrl = new URL(url);
  const shop = parsedUrl.searchParams.get('shop') ?? '';

  // Set shopifyMeta cookie
  if (shop) {
    const response = NextResponse.next();
    response.cookies.set('shopifyMeta', shop);
    return response;
  }

  // Get auth token
  let accessToken = '';
  if (cookie) {
    cookie = JSON.parse(cookie);
    accessToken = (cookie as { accessToken?: string })?.accessToken || '';
  }

  const route = request.nextUrl.pathname;

  const isLoggedIn = !!accessToken;

  if (!isPublicSync(route)) {
    if (isLoggedIn) {
      // user is authenticated.
      if (publicRoutes.includes(route) || route === '/spaces') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } else {
      // user is not authenticated
      // checking if route is a protected route.
      if (!publicRoutes.includes(route) && route !== '/') {
        const store = request.cookies.get('shopifyMeta')?.value || '';
        if (store) {
          return NextResponse.redirect(new URL('/', request.url));
        } else {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - connectors (connector images)
     * - valmi-logos
     * - other images
     */
    '/((?!api|_next/static|_next/image|favicon.ico|connectors|manifest.json|valmi_logo.svg|valmi_logo_no_text|images).*)'
  ]
};
