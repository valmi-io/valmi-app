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

const AUTH_META_COOKIE = 'authMeta';

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

export async function setAuthTokenCookie(authToken: string) {
  console.log('[cookies.ts] storing auth token:_', authToken);
  const data = {
    accessToken: authToken ?? ''
  };
  const { accessToken = '' } = (await getCookie(getAuthTokenCookie())) ?? '';

  if (!accessToken) {
    setCookie(getAuthTokenCookie(), JSON.stringify(data));
  }
}

export async function setAuthMetaCookie(data: any) {
  console.log('[cookies.ts] storing auth meta:_', data);
  const { meta = null } = (await getCookie(getAuthMetaCookie())) ?? {};
  if (!meta) {
    setCookie(getAuthMetaCookie(), JSON.stringify({ meta: { ...data } }));
  }
}
