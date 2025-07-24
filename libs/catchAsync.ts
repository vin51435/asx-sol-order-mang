import type { NextRequest } from 'next/server';
import { handleError } from '../controllers/globalErrorHandler';

type Handler = (req: NextRequest, ...args: any) => Promise<Response>;

export function catchAsync(fn: Handler): Handler {
  return async function (req?: NextRequest, ...args: any): Promise<Response> {
    try {
      return await fn(req, ...args);
    } catch (err) {
      return handleError(err);
    }
  };
}

