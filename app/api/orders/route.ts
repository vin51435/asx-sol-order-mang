import { createOrder, getOrders } from '@/controllers/orderController';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

// POST /api/orders - Create Order
export async function POST(req: NextRequest) {
  return createOrder(req);
}

// GET /api/orders
export async function GET(req: NextRequest) {
  return getOrders(req);
}

