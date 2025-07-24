import { NextRequest } from 'next/server';
import { serverHealth } from '../../../controllers/healthController';

export async function GET(req: NextRequest) {
  return await serverHealth(req);
}

