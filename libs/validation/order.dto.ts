import { z } from 'zod';

export const OrderDTO = z.object({
  customerName: z.string().min(3).max(30),
  email: z.email(),
  contactNumber: z.string().regex(/^\d{10}$/, 'Must be 10 digits'),
  shippingAddress: z.string().max(100).min(3),
  productName: z.string().min(3).max(50),
  quantity: z.coerce.number().min(1).max(100),
  productImage: z
    .instanceof(File)
    .refine(
      (val) => ['image/jpg', 'image/jpeg', 'image/png'].includes(val.type),
      {
        message: 'Image must be a JPG or PNG file',
      },
    )
    .refine((val) => val.size < 2 * 1024 * 1024, {
      message: 'Image size should be less than 2 MB',
    }),
});
export type OrderInput = z.infer<typeof OrderDTO>;

export const UpdateOrderQuantityDTO = z.object({
  quantity: z.coerce.number().min(1).max(100),
});
export type UpdateOrderQuantityInput = z.infer<typeof UpdateOrderQuantityDTO>;

