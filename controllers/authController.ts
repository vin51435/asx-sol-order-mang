import { connectDB } from '@/config/db';
import ApiError from '@/libs/ApiError';
import ApiResponse from '@/libs/ApiResponse';
import { catchAsync } from '@/libs/catchAsync';
import { AdminDTO } from '@/libs/validation/adminLogin.dto';
import { Admin } from '@/models/admin.model';
import { NextRequest } from 'next/server';
import { setAuthToken } from '@/libs/token';
import { requireAdmin } from '@/middlewares/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET!;

export const loginAdmin = catchAsync(async (req: NextRequest) => {
  await connectDB();

  const body = await req.json();
  const validatedBody = AdminDTO.parse(body);
  const { email, password } = validatedBody;

  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.comparePassword(password))) {
    throw new ApiError('Invalid credentials', 401);
  }

  const response = ApiResponse(200, 'Login successful', admin);

  return setAuthToken(response, { id: admin._id, role: 'admin' });
});

export const registerAdmin = catchAsync(async (req: NextRequest) => {
  await connectDB();

  const body = await req.json();
  const parsed = AdminDTO.parse(body);

  const existing = await Admin.findOne({ email: parsed.email });
  if (existing) {
    throw new ApiError('Admin with this email already exists', 409);
  }

  const newAdmin = await Admin.create(parsed);

  const response = ApiResponse(201, 'Admin created successfully', newAdmin);

  return setAuthToken(response, { id: newAdmin._id, role: 'admin' });
});

export const getUser = catchAsync(async (req: NextRequest) => {
  await connectDB();

  const payload = await requireAdmin(req);

  if (!payload) {
    throw new ApiError('Unauthorized: No token', 401);
  }

  const user = await Admin.findById(payload.id);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  return ApiResponse(200, 'User found', user);
});

