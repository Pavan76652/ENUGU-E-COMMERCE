import { z } from 'zod';

export const submitContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email(),
  phone: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : val),
    z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')
      .optional()
  ),
  subject: z.string().min(3, 'Subject is required').max(150),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export default { submitContactSchema };
