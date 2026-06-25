import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID');

export const addWishlistItemSchema = z.object({
  productId: objectId,
});

export const syncWishlistSchema = z.object({
  items: z
    .array(
      z.object({
        productId: objectId.optional(),
        id: objectId.optional(),
      })
    )
    .default([]),
});

export default { addWishlistItemSchema, syncWishlistSchema };
