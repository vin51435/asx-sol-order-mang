import { registerAdmin } from '@/controllers/authController';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  return registerAdmin(req);
}

