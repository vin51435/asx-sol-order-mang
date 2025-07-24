import { getUser } from '@/controllers/authController';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  return getUser(req);
}

