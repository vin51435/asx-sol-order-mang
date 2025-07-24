import {
  deleteOrder,
  getOrderById,
  updateOrderQuantity,
} from '@/controllers/orderController';
import { NextRequest } from 'next/server';

/**
 * GET
 */
export async function GET(req: NextRequest, { params }) {
  const { id } = await params;
  return getOrderById(req, id);
}

/**
 * PATCH /api/orders/:id
 * @access Admin
 */
export async function PATCH(req: NextRequest, { params }) {
  const { id } = await params;
  return updateOrderQuantity(req, id);
}

export async function DELETE(req: NextRequest, { params }) {
  const { id } = await params;
  return deleteOrder(req, id);
}

