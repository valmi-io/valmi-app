/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Tuesday, January 30th 2024, 12:02:48 pm
 * Author: Nagendra S @ valmi.io
 */

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
