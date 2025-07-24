import { NextResponse } from 'next/server';
import responseMessages from './constants/responseMessages';
import {
  IPaginatedResponse,
  AppPaginatedResponse,
} from '../types/api.response.paginated';
import {
  IResponseExtra,
  IResponseData,
  IApiResponse,
} from '../types/api.response';
import { IResponseMessage } from '../types/api.response.message';

/**
 * Returns a JSON response with the given status code, message, and data.
 *
 * @param {number} [statusCode=200] - The HTTP status code.
 * @param {IResponseMessage} [message] - The response message. Defaults to the appropriate message
 *   from the responseMessages object.
 * @param {IResponseData} [data] - The response data.
 * @param {IResponseExtra} [extra] - Additional fields to include in the response.
 *
 * @returns {Response<IApiResponse<IResponseData>>} - The response with the given status code, message,
 *   and data.
 */
export default function ApiResponse<
  ResponseDataType = any,
  ExtraDataType extends IResponseExtra = IResponseExtra,
>(
  statusCode: number = 200,
  message: IResponseMessage | string | null = null,
  data: IResponseData<ResponseDataType> | null = null,
  extra: ExtraDataType = {} as ExtraDataType,
): NextResponse<IApiResponse<IResponseData<ResponseDataType>>> {
  message = message ?? responseMessages.GENERAL.SUCCESS;

  return NextResponse.json(
    {
      status: 'success',
      message,
      ...(data && { data }),
      ...extra,
    },
    { status: statusCode },
  );
}

/**
 * Helper function to return a paginated response
 * @param data The paginated data to be returned
 * @returns The response object with the paginated data
 */
export function ApiPaginatedResponse<T = any>(
  data: IPaginatedResponse<T>,
): AppPaginatedResponse<T> {
  return NextResponse.json({
    ...data,
  });
}

