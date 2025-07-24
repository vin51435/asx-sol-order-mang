import { Document } from 'mongoose';

export interface IOrder {
  _id?: string;
  customerName: string;
  email: string;
  contactNumber: string;
  shippingAddress: string;
  productName: string;
  quantity: number;
  productImageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderDocument = Document & IOrder;

