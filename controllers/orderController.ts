import { NextRequest } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuid } from 'uuid';
import { FetchPaginatedDataWithAggregation } from '@/libs/mongodb.pagination';
import ApiError from '@/libs/ApiError';
import ApiResponse, { ApiPaginatedResponse } from '@/libs/ApiResponse';
import { catchAsync } from '@/libs/catchAsync';
import { OrderDTO, UpdateOrderQuantityDTO } from '@/libs/validation/order.dto';
import { Order } from '@/models/order.model';
import { requireAdmin } from '@/middlewares/authMiddleware';
import { connectDB } from '@/config/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Create order
 * @route POST /api/orders
 */
export const createOrder = catchAsync(async (req: NextRequest) => {
  await connectDB();

  const formData = await req.formData();

  const raw = {
    customerName: formData.get('customerName'),
    email: formData.get('email'),
    contactNumber: formData.get('contactNumber'),
    shippingAddress: formData.get('shippingAddress'),
    productName: formData.get('productName'),
    quantity: formData.get('quantity'),
    productImage: formData.get('productImage'),
  };

  const parsed = OrderDTO.parse(raw);

  const {
    customerName,
    email,
    contactNumber,
    shippingAddress,
    productName,
    quantity,
    productImage,
  } = parsed;

  // Validate file is a real `File`
  if (!(productImage instanceof File)) {
    throw new ApiError('Invalid or missing image', 400);
  }

  // Validate image format and size
  const allowedTypes = ['image/jpeg', 'image/png'];
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!allowedTypes.includes(productImage.type)) {
    throw new ApiError('Only JPG and PNG files are allowed', 400);
  }

  if (productImage.size > maxSize) {
    throw new ApiError('File size must be less than 2MB', 400);
  }

  const buffer = Buffer.from(await productImage.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), 'public/uploads');

  // Ensure upload dir exists
  await fs.mkdir(uploadsDir, { recursive: true });

  // Create filename
  const filename = `${uuid()}-${productImage.name.replace(/\s/g, '_')}`;
  const imagePath = path.join(uploadsDir, filename);
  const imageUrl = `/uploads/${filename}`;

  // Write file to disk
  await fs.writeFile(imagePath, buffer);

  // Save order in DB
  const order = await Order.create({
    customerName,
    email,
    contactNumber,
    shippingAddress,
    productName,
    quantity,
    productImageUrl: imageUrl,
  });

  return ApiResponse(201, 'Order placed successfully', order);
});

/**
 * Get orders or a order by id
 * @route GET /api/orders
 */
export const getOrders = catchAsync(async (req: NextRequest) => {
  await connectDB();

  const fetechedData = await FetchPaginatedDataWithAggregation(Order, [], {
    page: req.nextUrl.searchParams.get('page') || '1',
    pageSize: req.nextUrl.searchParams.get('limit') || '10',
    sortField: req.nextUrl.searchParams.get('sortField') ?? 'createdAt',
    sortOrder: req.nextUrl.searchParams.get('sortOrder') ?? 'desc',
    searchFields: req.nextUrl.searchParams.get('searchFields') ?? [
      'customerName',
      'email',
      'contactNumber',
      'productName',
    ],
    searchValue: req.nextUrl.searchParams.get('search') || '',
  });

  return ApiPaginatedResponse(fetechedData);
});

/**
 * Get order by id
 * @route GET /api/orders/:id
 */
export const getOrderById = catchAsync(async (_req: NextRequest, id) => {
  await connectDB();

  const order = await Order.findById(id);

  if (!order) throw new ApiError('Order not found', 404);
  return ApiResponse(200, 'Order found', order);
});

/**
 * Update order quantity
 * @route PATCH /api/orders/:id
 * @access Admin
 */
export const updateOrderQuantity = catchAsync(async (req: NextRequest, id) => {
  await connectDB();

  await requireAdmin(req);

  const body = await req.json();
  const validatedBody = UpdateOrderQuantityDTO.parse(body);
  const { quantity } = validatedBody;

  const order = await Order.findByIdAndUpdate(
    id,
    { quantity },
    { new: true, runValidators: true },
  );

  if (!order) throw new ApiError('Order not found', 404);
  return ApiResponse(200, 'Order updated successfully', order);
});

/**
 * Delete order
 * @route DELETE /api/orders/:id
 * @access Admin
 */
export const deleteOrder = catchAsync(async (req: NextRequest, id) => {
  await connectDB();

  await requireAdmin(req);

  const order = await Order.findByIdAndDelete(id);
  if (!order) throw new ApiError('Order not found', 404);
  return ApiResponse(200, 'Order deleted successfully', order);
});

