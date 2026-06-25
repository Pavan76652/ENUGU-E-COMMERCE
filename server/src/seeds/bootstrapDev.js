import User from '../models/User.js';
import { ensureDefaultSizeGuide } from './ensureDefaultSizeGuide.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import ActivityLog from '../models/ActivityLog.js';
import { ROLES } from '../constants/roles.js';
import { ORDER_STATUS, PAYMENT_STATUS } from '../constants/orderStatus.js';
import { AUDIT_ACTIONS, AUDIT_RESOURCES } from '../constants/auditActions.js';
import { PERMISSIONS } from '../constants/permissions.js';
import env from '../config/env.js';
const DEFAULT_CATEGORIES = [
  { name: 'Graphic Tees', slug: 'graphic-tees', sortOrder: 1 },
  { name: 'Oversized Tees', slug: 'oversized-tees', sortOrder: 2 },
  { name: 'Custom Prints', slug: 'custom-prints', sortOrder: 3 },
];

const DEV_CUSTOMER = {
  email: 'customer@enugu.com',
  password: 'Customer@123',
  firstName: 'Rahul',
  lastName: 'Sharma',
  phone: '9876543210',
};

const seedDevCustomer = async () => {
  const existing = await User.findByEmail(DEV_CUSTOMER.email);
  if (existing) return existing;

  const customer = await User.create({
    firstName: DEV_CUSTOMER.firstName,
    lastName: DEV_CUSTOMER.lastName,
    email: DEV_CUSTOMER.email,
    password: DEV_CUSTOMER.password,
    phone: DEV_CUSTOMER.phone,
    role: ROLES.CUSTOMER,
    isEmailVerified: true,
    isActive: true,
    addresses: [
      {
        label: 'Home',
        fullName: 'Rahul Sharma',
        phone: DEV_CUSTOMER.phone,
        addressLine1: '42 MG Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India',
        isDefault: true,
      },
    ],
  });

  console.log(`Dev customer created: ${DEV_CUSTOMER.email}`);
  return customer;
};

const seedSampleOrder = async (customer) => {
  const existingOrder = await Order.findOne({ userId: customer._id });
  if (existingOrder) return;

  const product = await Product.findOne({ status: 'published' }) ?? (await Product.findOne());
  if (!product) return;

  const size = product.sizeStock?.[0]?.size ?? 'M';
  const unitPrice = product.sellingPrice;
  const quantity = 1;

  await Order.create({
    orderNumber: `ENUGU-${Date.now().toString().slice(-8)}`,
    userId: customer._id,
    items: [
      {
        productId: product._id,
        name: product.name,
        image: product.images?.[0]?.url ?? '',
        variantSku: product.sku,
        size,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
      },
    ],
    shippingAddress: customer.addresses[0],
    pricing: {
      subtotal: unitPrice * quantity,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: unitPrice * quantity,
    },
    status: ORDER_STATUS.CONFIRMED,
    paymentStatus: PAYMENT_STATUS.PENDING,
    paymentMethod: 'cod',
    statusHistory: [
      {
        status: ORDER_STATUS.PENDING,
        note: 'Order placed',
        timestamp: new Date(),
      },
      {
        status: ORDER_STATUS.CONFIRMED,
        note: 'Confirmed for fulfillment',
        timestamp: new Date(),
      },
    ],
  });

  console.log('Dev sample order created for customer');
};

const seedSampleActivityLogs = async () => {
  const count = await ActivityLog.countDocuments();
  if (count > 0) return;

  const admin = await User.findByEmail(env.superAdmin.email);
  if (!admin) return;

  const order = await Order.findOne().sort({ createdAt: -1 });
  const product = await Product.findOne();

  const entries = [
    {
      actorId: admin._id,
      actorRole: admin.role,
      actorEmail: admin.email,
      action: AUDIT_ACTIONS.PRODUCT_CREATED,
      resource: AUDIT_RESOURCES.PRODUCT,
      resourceId: product?._id,
      metadata: product ? { name: product.name, sku: product.sku } : { note: 'Dev bootstrap' },
      ipAddress: '127.0.0.1',
    },
  ];

  if (order) {
    entries.push({
      actorId: admin._id,
      actorRole: admin.role,
      actorEmail: admin.email,
      action: AUDIT_ACTIONS.ORDER_STATUS_UPDATED,
      resource: AUDIT_RESOURCES.ORDER,
      resourceId: order._id,
      metadata: {
        orderNumber: order.orderNumber,
        status: order.status,
        note: 'Confirmed for fulfillment',
      },
      ipAddress: '127.0.0.1',
    });
  }

  await ActivityLog.insertMany(entries);
  console.log(`Dev activity logs seeded: ${entries.length}`);
};

const seedDevAdmin = async (createdBy) => {
  const email = 'manager@enugu.com';
  const existing = await User.findByEmail(email);
  if (existing) return;

  await User.create({
    firstName: 'Priya',
    lastName: 'Manager',
    email,
    password: 'Manager@123',
    phone: '9123456780',
    role: ROLES.ADMIN,
    permissions: [
      PERMISSIONS.PRODUCTS_CREATE,
      PERMISSIONS.PRODUCTS_UPDATE,
      PERMISSIONS.ORDERS_READ,
      PERMISSIONS.ORDERS_UPDATE,
      PERMISSIONS.CUSTOMERS_READ,
      PERMISSIONS.COUPONS_MANAGE,
      PERMISSIONS.SIZE_GUIDES_MANAGE,
    ],
    isEmailVerified: true,
    isActive: true,
    createdBy: createdBy?._id,
  });

  console.log(`Dev admin created: ${email} / Manager@123`);
};

const seedDefaultSizeGuide = async () => {
  const guide = await ensureDefaultSizeGuide();
  if (guide) {
    console.log('Default ENUGU size guide ready');
  }
  return guide;
};

export const bootstrapDevData = async () => {  if (env.mongodb.uri !== 'memory') return;

  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES);
    console.log(`Dev categories seeded: ${DEFAULT_CATEGORIES.length}`);
  }

  const email = env.superAdmin.email;
  const password = env.superAdmin.password;

  if (!email || !password) {
    console.warn('Dev bootstrap skipped — SUPER_ADMIN_EMAIL/PASSWORD not set');
  } else {
    const existing = await User.findByEmail(email);
    let superAdmin = existing;
    if (!existing) {
      superAdmin = await User.create({
        firstName: env.superAdmin.firstName,
        lastName: env.superAdmin.lastName,
        email,
        password,
        role: ROLES.SUPER_ADMIN,
        isEmailVerified: true,
        isActive: true,
      });
      console.log(`Dev super admin created: ${email}`);
    } else {
      console.log(`Dev super admin ready: ${email}`);
    }
    await seedDevAdmin(superAdmin);
  }

  const customer = await seedDevCustomer();
  if (customer) {
    await seedSampleOrder(customer);
  }

  await seedSampleActivityLogs();
  await seedDefaultSizeGuide();
};
export default { bootstrapDevData };
