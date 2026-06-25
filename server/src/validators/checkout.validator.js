import { z } from 'zod';
import { ALL_PAYMENT_METHODS } from '../constants/paymentMethods.js';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID');

export const cartItemSchema = z.object({
  productId: objectId,
  size: z.string().min(1),
  quantity: z.number().int().positive().max(10),
});

export const addressSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  addressLine1: z.string().min(5).max(200),
  addressLine2: z.string().max(200).optional().default(''),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  country: z.string().default('India'),
});

export const savedAddressSchema = addressSchema.extend({
  label: z.string().min(1).max(50).optional().default('Home'),
  isDefault: z.boolean().optional().default(false),
});

export const previewCheckoutSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  couponCode: z.string().trim().optional(),
});

export const createOrderSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  shippingAddress: addressSchema,
  couponCode: z.string().trim().optional(),
  paymentMethod: z.enum(ALL_PAYMENT_METHODS).default('cod'),
  notes: z.string().max(500).optional(),
});

export const validateCouponSchema = z.object({
  code: z.string().min(3).max(20),
  subtotal: z.number().positive(),
});

export default {
  cartItemSchema,
  addressSchema,
  savedAddressSchema,
  previewCheckoutSchema,
  createOrderSchema,
  validateCouponSchema,
};
