import { RateLimiterMemory } from 'rate-limiter-flexible';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getClientIp } from '../libs/getIp';

const rateLimiter = new RateLimiterMemory({
  points: 25, // 25 requests
  duration: 60, // per 60 seconds per IP
});

export async function checkRateLimit(req: NextRequest) {
  const ip = getClientIp(req);

  try {
    await rateLimiter.consume(ip);
    return null;
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Too many requests' },
      { status: 429 },
    );
  }
}

