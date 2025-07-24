import { NextRequest, NextResponse } from 'next/server';
import { handleCors } from './middlewares/cors';
import { checkRateLimit } from './middlewares/rateLimiter';
import { protect } from '@/middlewares/authMiddleware';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next();

  // Only apply to /api routes
  if (req.nextUrl.pathname.startsWith('/api')) {
    res = handleCors(req, res); // always apply headers

    // If CORS returned a preflight OPTIONS response
    if (res instanceof Response && req.method === 'OPTIONS') {
      return res;
    }

    const rateLimitResult = await checkRateLimit(req);
    if (rateLimitResult) return rateLimitResult;

    return await protect(req);
  }

  return res;
}

export const config = {
  matcher: ['/api/:path*'],
};

