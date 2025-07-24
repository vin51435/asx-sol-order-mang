import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/libs/token';
import ApiError from '@/libs/ApiError';

const protectedRoutes = ['/api/admin'];

// Middleware version
export const protect = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith('/api')) return NextResponse.next();

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    try {
      const token = req.cookies.get('token')?.value;

      if (!token) {
        return NextResponse.json(
          { message: 'Unauthorized: No token' },
          { status: 401 },
        );
      }

      const payload = await verifyAuthToken(token);

      if (!payload) {
        return NextResponse.json(
          { message: 'Unauthorized: Invalid token' },
          { status: 401 },
        );
      }

      const res = NextResponse.next();
      res.headers.set('x-user-id', payload.id);
      res.headers.set('x-user-role', payload.role);
      return res;
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
};

export const requireAdmin = async (req: NextRequest) => {
  const token = req.cookies.get('token');

  if (!token) {
    throw new ApiError('Unauthorized: No token', 401);
  }

  const tokenValue = token.value;

  const payload = await verifyAuthToken(tokenValue);

  if (!payload) {
    return NextResponse.json(
      { message: 'Unauthorized: Invalid token' },
      { status: 401 },
    );
  }

  if (!payload || payload?.role !== 'admin') {
    throw new ApiError('Unauthorized: Not admin', 403);
  }

  return payload;
};

