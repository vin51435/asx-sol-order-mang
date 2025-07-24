import mongoose, { Model, Schema } from 'mongoose';
import { IOrder, OrderDocument } from '../types/order';

const orderSchema = new Schema<OrderDocument>(
  {
    customerName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      match: /^\S+@\S+\.\S+$/,
    },
    contactNumber: {
      type: String,
      required: true,
      match: /^\d{10}$/,
    },
    shippingAddress: {
      type: String,
      required: true,
      maxlength: 100,
    },
    productName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    productImageUrl: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const Order: Model<OrderDocument> =
  mongoose.models.Order || mongoose.model<OrderDocument>('Order', orderSchema);

