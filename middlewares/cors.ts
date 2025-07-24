import { NextRequest, NextResponse } from 'next/server';

export function handleCors(req: NextRequest, res: NextResponse) {
  // set CORS headers
  // res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  );
  res.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  );

  // Handle preflight request early
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: res.headers,
    });
  }

  return res;
}

