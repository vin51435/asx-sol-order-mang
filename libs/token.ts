import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;
const isProd = process.env.NODE_ENV === 'production';

// Sign token and return a response with cookie set
export function setAuthToken(res: NextResponse, payload: object): NextResponse {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  res.cookies.set('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });

  return res;
}

// Verify token
export function verifyAuthToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function decodeAuthToken(token: string) {
  verifyAuthToken(token);

  const decoded = jwt.decode(token, JWT_SECRET);
  return decoded;
}

