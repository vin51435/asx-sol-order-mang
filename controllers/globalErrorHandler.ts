import { CastError, Error as MongooseError } from 'mongoose';
import ApiError from '../libs/ApiError';
import { ErrorCodes } from '../libs/constants/errorCodes';
import responseMessages from '../libs/constants/responseMessages';
import { ZodError } from 'zod';

export function handleError(error: any): Response {
  let err = error;
  console.error('Caught error:', err);
  // console.log({ err });

  // Convert known errors
  if (err instanceof ZodError) err = handleZodError(err);
  if (err.name === 'CastError') err = handleCastErrorDB(err);
  if (err.code === 11000) err = handleMongoServerError(err);
  if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
  if (err.name === 'MulterError') err = handleMulterError(err);
  if (err.isAxiosError)
    err = new ApiError(responseMessages.GENERAL.SERVER_ERROR, 500);
  if (err.name === 'JsonWebTokenError') err = handleJwtError();
  if (err.name === 'TokenExpiredError') err = handleJwtExpiredError();

  // Fallback error if not already ApiError
  if (!(err instanceof ApiError)) {
    err = new ApiError(
      responseMessages.GENERAL.SERVER_ERROR,
      500,
      ErrorCodes.SERVER.UNKNOWN_ERROR,
    );
  }

  const base = {
    status: err.status,
    message: err.message,
    errorCode: err.errorCode,
    ...(err.redirectUrl && { redirectUrl: err.redirectUrl }),
  };

  const env = process.env.NODE_ENV;

  // Dev mode = more details
  const devExtras =
    env === 'development'
      ? {
          errorName: err.name,
          stack: err.stack,
          error: error, // original error object
        }
      : {};

  return Response.json(
    {
      ...base,
      ...devExtras,
    },
    { status: err.statusCode },
  );
}

export function handleZodError(error: unknown): ApiError {
  if (error instanceof ZodError) {
    const message = error.issues
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join('; ');

    return new ApiError(message, 400, ErrorCodes.CLIENT.MISSING_INVALID_INPUT);
  }

  return new ApiError(
    'Invalid input data',
    400,
    ErrorCodes.CLIENT.MISSING_INVALID_INPUT,
  );
}

function handleCastErrorDB(err: CastError) {
  return new ApiError(
    `Invalid ${err.path}: ${err.value}` as string,
    400,
    ErrorCodes.CLIENT.MISSING_INVALID_INPUT,
  );
}

function handleMongoServerError(err: any) {
  if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern || {});
    const values = Object.values(err.keyValue || {});
    const fieldList = fields.map((f, i) => `${f}: "${values[i]}"`).join(', ');
    return new ApiError(
      `Duplicate value for field(s): ${fieldList}` as string,
      400,
      ErrorCodes.DATA.ALREADY_EXISTS,
    );
  }

  return new ApiError(
    'An unknown MongoDB error occurred',
    500,
    ErrorCodes.SERVER.UNKNOWN_ERROR,
  );
}

function handleMulterError(err: any) {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new ApiError(
      `Image too large, max size: 2` as string,
      400,
      ErrorCodes.CLIENT.IMAGE_TOO_LARGE,
    );
  }

  return new ApiError(
    responseMessages.CLIENT.INVALID_IMAGE_FORMAT_OR_SIZE,
    400,
    ErrorCodes.CLIENT.IMAGE_TOO_LARGE,
  );
}

function handleValidationErrorDB(err: MongooseError.ValidationError) {
  const messages = Object.values(err.errors)
    .map((el) => el.message)
    .join('. ');
  return new ApiError(
    `Invalid input: ${messages}` as string,
    400,
    ErrorCodes.CLIENT.MISSING_INVALID_INPUT,
  );
}

function handleJwtError() {
  return new ApiError(
    responseMessages.AUTH.INVALID_TOKEN,
    401,
    ErrorCodes.CLIENT.UNAUTHENTICATED,
  );
}

function handleJwtExpiredError() {
  return new ApiError(
    responseMessages.AUTH.TOKEN_EXPIRED,
    401,
    ErrorCodes.CLIENT.UNAUTHENTICATED,
  );
}

