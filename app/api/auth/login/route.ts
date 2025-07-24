import { loginAdmin } from '@/controllers/authController';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  return await loginAdmin(req);
}

