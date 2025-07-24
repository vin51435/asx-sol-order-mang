// Form middleware

import { cookies } from 'next/headers';
const isProd = process.env.NODE_ENV === 'production';

// Get a cookie by name
export async function getCookie(name: string) {
  const cookieStore = await cookies();

  const value = cookieStore.get(name)?.value;
  return value || null;
}

// Set a cookie
export async function setCookie(
  name: string,
  value: string,
  options?: Partial<CookieOptions>,
) {
  const cookieStore = await cookies();

  cookieStore.set({
    name,
    value,
    secure: isProd,
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days by default
    ...options,
  });
}

// Delete a cookie
export async function deleteCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

interface CookieOptions {
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
}

