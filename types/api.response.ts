import { NextResponse } from 'next/server';
import { IResponseMessage } from './api.response.message';
import { ErrorCodeType } from './api.response.error';

export type AppResponse<
  ResponseType = IApiResponse,
  DataType = any,
> = NextResponse<ResponseType & { data?: IResponseData<DataType> }>;

export interface IApiResponse<T = any>
  extends IBaseApiResponse,
    Omit<IResponseExtra<T>, 'message'> {}

export interface IBaseApiResponse {
  status: 'success' | 'error';
  message: IResponseMessage | string;
}

export interface IResponseExtra<T = any> {
  authenticated?: boolean;
  redirectUrl?: string;
  errorCode?: ErrorCodeType;
}

export interface IResponseData<T = any> {
  email?: string;
  [key: string]: T | any;
}

export interface IResponseExtraCommentPagination extends IResponseExtra {
  hasMore: boolean;
  totalRootComments: number;
  rootId: string;
  depth: number;
  limit: number;
  page: number;
  skip: number;
  childLimit: number;
  childSkip: number;
}

