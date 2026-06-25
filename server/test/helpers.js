import mongoose from 'mongoose';
import Product from '../src/models/Product.js';
import User from '../src/models/User.js';
// Registering Category ensures populate('categoryId') works during checkout.
import '../src/models/Category.js';
import { PRODUCT_STATUS } from '../src/constants/productStatus.js';
import { ROLES } from '../src/constants/roles.js';

let counter = 0;

export const createProduct = async (overrides = {}) => {
  counter += 1;
  const sizeStock = overrides.sizeStock ?? [
    { size: 'S', stock: 5 },
    { size: 'M', stock: 5 },
    { size: 'L', stock: 5 },
    { size: 'XL', stock: 5 },
    { size: 'XXL', stock: 5 },
  ];

  return Product.create({
    name: overrides.name ?? `Test Tee ${counter}`,
    slug: overrides.slug ?? `test-tee-${counter}`,
    sku: overrides.sku ?? `SKU-${counter}`,
    categoryId: overrides.categoryId ?? new mongoose.Types.ObjectId(),
    mrp: overrides.mrp ?? 1000,
    sellingPrice: overrides.sellingPrice ?? 800,
    status: overrides.status ?? PRODUCT_STATUS.PUBLISHED,
    sizeStock,
  });
};

export const createUser = async (overrides = {}) => {
  counter += 1;
  return User.create({
    firstName: overrides.firstName ?? 'Test',
    lastName: overrides.lastName ?? 'User',
    email: overrides.email ?? `user${counter}@example.com`,
    password: overrides.password ?? 'Password123',
    role: overrides.role ?? ROLES.CUSTOMER,
  });
};

export const toAuthUser = (user) => ({
  id: user._id.toString(),
  email: user.email,
  firstName: user.firstName,
  role: user.role,
  permissions: user.permissions ?? [],
});

export const sampleShippingAddress = () => ({
  fullName: 'Test User',
  phone: '9876543210',
  addressLine1: '12 Test Street',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  country: 'India',
});
