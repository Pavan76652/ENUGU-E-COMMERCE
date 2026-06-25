import { z } from 'zod';
import { PRODUCT_SIZES } from '../constants/productStatus.js';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID');

export const subscribeStockNotificationSchema = z.object({
  productId: objectId,
  email: z.string().email(),
  size: z.enum(PRODUCT_SIZES).optional().nullable(),
});

export default { subscribeStockNotificationSchema };
