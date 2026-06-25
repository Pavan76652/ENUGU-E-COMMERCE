import { z } from 'zod';

export const createDesignRequestSchema = z.object({
  customerName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  designDescription: z.string().min(10).max(2000),
  quantity: z.coerce.number().int().positive().max(10000),
});

export default { createDesignRequestSchema };
