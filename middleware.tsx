/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, June 12th 2023, 9:28:37 pm
 * Author: Nagendra S @ valmi.io
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { isPublicSync, publicRoutes } from '@utils/routes';

export function middleware(request: NextRequest) {
  let cookie = request.cookies.get('AUTH')?.value;
  let bearerToken = '';
  if (cookie) {
    cookie = JSON.parse(cookie);
    bearerToken = (cookie as { accessToken?: string })?.accessToken || '';
  }

  const pathName = request.nextUrl.pathname;

  if (!isPublicSync(pathName)) {
    if (bearerToken) {
      // user is authenticated.
      if (publicRoutes.includes(pathName) || isUserActivateRoute(pathName)) {
        return NextResponse.rewrite(new URL('/', request.url));
      }
    } else {
      // user is not authenticated
      // checking if pathname is a protected route.

      if (!publicRoutes.includes(pathName)) {
        if (!isUserActivateRoute(pathName) && !isResetPasswordRoute(pathName)) {
          return NextResponse.rewrite(new URL('/login', request.url));
        }
      }
    }
  }
}

const isUserActivateRoute = (pathname: string): boolean => {
  if (pathname.startsWith('/activate')) {
    // checking if pathname is  /activate/[uid]/[tid]
    if (pathname.split('/').length !== 4) return false;

    return true;
  }
  return false;
};

const isResetPasswordRoute = (pathname: string): boolean => {
  if (pathname.startsWith('/reset_password')) {
    // checking if pathname is  /reset_password/[uid]/[tid]
    if (pathname.split('/').length !== 4) return false;

    return true;
  }
  return false;
};

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
