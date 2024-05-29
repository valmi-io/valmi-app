import Cookies from 'react-cookies';

// Type for the options object used in cookie operations
type CookieOptions = {
  path?: string;
  expires?: Date;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
};

const AUTH_TOKEN_COOKIE = 'auth';

const AUTH_META_COOKIE = 'additionalAuthParams';

// Function to set a cookie
export async function setCookie(name: string, value: string, options: CookieOptions = {}) {
  try {
    Cookies.save(name, value, options);
    return {
      success: true
    };
  } catch (error) {
    return {
      error: true
    };
  }
}

// Function to get a cookie
export function getCookie(name: string) {
  return Cookies.load(name);
}

// Function to clear a cookie
export function clearCookie(name: string, options: CookieOptions = {}): void {
  Cookies.remove(name, options);
}

export function getAuthTokenCookie() {
  return AUTH_TOKEN_COOKIE;
}

export function getAuthMetaCookie() {
  return AUTH_META_COOKIE;
}
