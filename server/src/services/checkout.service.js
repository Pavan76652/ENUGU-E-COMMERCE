import Product from '../models/Product.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import { generateOrderNumber } from '../utils/orderNumber.js';
import { calculateOrderPricing } from '../utils/pricing.js';
import { validateCouponForCheckout, incrementCouponUsage } from './storefrontCoupon.service.js';
import { getPaymentProvider } from './payment/paymentProvider.js';
import { decrementStock } from './inventory.service.js';
import { sendOrderConfirmationEmail } from './email.service.js';
import { PAYMENT_METHODS } from '../constants/paymentMethods.js';
import { ORDER_STATUS } from '../constants/orderStatus.js';
import { PRODUCT_STATUS } from '../constants/productStatus.js';
import { withTransaction } from '../utils/withTransaction.js';
import { getPagination, buildPaginationMeta, parseSort } from '../utils/pagination.js';
import logger from '../config/logger.js';

const getCoverImage = (product) => {
  const cover = product.images?.find((img) => img.isCover) ?? product.images?.[0];
  return cover?.url ?? '';
};

export const previewCheckout = async ({ items, couponCode, userId }) => {
  const { validatedItems, subtotal, categoryIds } = await validateCartItems(items);

  let coupon = null;

  if (couponCode) {
    coupon = await validateCouponForCheckout({
      code: couponCode,
      subtotal,
      userId,
      categoryIds,
    });
  }

  const pricing = calculateOrderPricing({ subtotal, coupon });

  return {
    items: validatedItems,
    pricing: {
      ...pricing,
      couponCode: coupon?.code ?? null,
    },
    coupon,
  };
};

export const createOrder = async (user, payload) => {
  const {
    items,
    shippingAddress,
    couponCode,
    paymentMethod = PAYMENT_METHODS.COD,
    notes,
  } = payload;

  if (!shippingAddress) {
    throw new ApiError(400, 'Shipping address is required');
  }

  if (!Object.values(PAYMENT_METHODS).includes(paymentMethod)) {
    throw new ApiError(400, 'Invalid payment method');
  }

  const { validatedItems, subtotal, categoryIds } = await validateCartItems(items);

  let coupon = null;

  if (couponCode) {
    coupon = await validateCouponForCheckout({
      code: couponCode,
      subtotal,
      userId: user.id,
      categoryIds,
    });
  }

  const pricing = calculateOrderPricing({ subtotal, coupon });
  const orderNumber = await generateOrderNumber(Order);

  const orderItems = validatedItems.map((item) => ({
    productId: item.productId,
    name: item.name,
    image: item.image,
    variantSku: item.sku,
    size: item.size,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.unitPrice * item.quantity,
  }));

  // Decrement stock, create the order and consume the coupon atomically so a
  // failure anywhere rolls everything back (prevents overselling / partial state).
  const order = await withTransaction(async (session) => {
    await decrementStock(validatedItems, session);

    const [created] = await Order.create(
      [
        {
          orderNumber,
          userId: user.id,
          items: orderItems,
          shippingAddress,
          pricing: {
            subtotal: pricing.subtotal,
            discount: pricing.discount,
            couponCode: coupon?.code,
            shipping: pricing.shipping,
            tax: pricing.tax,
            total: pricing.total,
          },
          status: ORDER_STATUS.PENDING,
          paymentMethod,
          notes,
          statusHistory: [
            {
              status: ORDER_STATUS.PENDING,
              changedBy: user.id,
              note: 'Order placed',
              timestamp: new Date(),
            },
          ],
        },
      ],
      { session }
    );

    if (coupon?.code) {
      await incrementCouponUsage(coupon.code, session);
    }

    return created;
  });

  const provider = getPaymentProvider(paymentMethod);
  const paymentResult = await provider.processOrder(order);

  // Best-effort confirmation email — never fails the order if email is down.
  sendOrderConfirmationEmail({
    email: user.email,
    firstName: user.firstName,
    order: paymentResult.order,
  }).catch((error) => {
    logger.error({ err: error, orderNumber }, 'Order confirmation email failed');
  });

  return paymentResult;
};

export const getMyOrders = async (userId, query = {}) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { userId };

  if (query.status) filter.status = query.status;

  const sort = parseSort(query.sortBy || 'createdAt', query.sortOrder || 'desc');

  const [orders, total] = await Promise.all([
    Order.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);

  return { orders, meta: buildPaginationMeta(total, page, limit) };
};

export const getMyOrderByNumber = async (userId, orderNumber) => {
  const order = await Order.findOne({ orderNumber, userId }).lean();

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  return order;
};

const validateCartItems = async (items = []) => {
  if (!items.length) {
    throw new ApiError(400, 'Cart is empty');
  }

  const validatedItems = [];
  let subtotal = 0;
  const categoryIds = [];

  for (const item of items) {
    if (!item.productId || !item.size || !item.quantity) {
      throw new ApiError(400, 'Invalid cart item');
    }

    const product = await Product.findById(item.productId).populate('categoryId', 'name slug');

    if (!product) {
      throw new ApiError(404, `Product not found`);
    }

    if (![PRODUCT_STATUS.PUBLISHED, PRODUCT_STATUS.SOLD_OUT].includes(product.status)) {
      throw new ApiError(400, `${product.name} is not available`);
    }

    const sizeEntry = product.sizeStock.find((s) => s.size === item.size);

    if (!sizeEntry || sizeEntry.stock < item.quantity) {
      throw new ApiError(400, `${product.name} (${item.size}) is out of stock`);
    }

    const unitPrice = product.sellingPrice;
    subtotal += unitPrice * item.quantity;

    if (product.categoryId) {
      categoryIds.push(product.categoryId._id ?? product.categoryId);
    }

    validatedItems.push({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      image: getCoverImage(product),
      size: item.size,
      quantity: item.quantity,
      unitPrice,
      mrp: product.mrp,
    });
  }

  return { validatedItems, subtotal, categoryIds };
};

export default { previewCheckout, createOrder, getMyOrders, getMyOrderByNumber };
