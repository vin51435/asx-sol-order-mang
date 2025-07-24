import z from 'zod';

export const AdminDTO = z.object({
  email: z.email(),
  password: z.string().min(3).nonempty(),
});
export type AdminInput = z.infer<typeof AdminDTO>;

