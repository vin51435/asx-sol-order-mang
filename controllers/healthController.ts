import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import ApiResponse from '../libs/ApiResponse';
import { catchAsync } from '../libs/catchAsync';

export const serverHealth = catchAsync(async () => {
  await connectDB();

  const data = {
    message: 'Server is running',
    db: {
      connected: mongoose.connections[0].readyState === 1,
    },
    server: {
      platform: process.platform,
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
    },
  };

  return ApiResponse(200, null, data);
});

