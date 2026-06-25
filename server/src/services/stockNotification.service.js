import StockNotification, { NOTIFICATION_STATUS } from '../models/StockNotification.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import { isFullySoldOut } from '../utils/productHelpers.js';
import { sendBackInStockEmail } from './email.service.js';

export const subscribeToStockNotification = async ({
  productId,
  email,
  size = null,
  userId = null,
}) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (size) {
    const sizeEntry = product.sizeStock.find((s) => s.size === size);
    if (sizeEntry && sizeEntry.stock > 0) {
      throw new ApiError(400, 'This size is already in stock');
    }
  } else if (!isFullySoldOut(product.sizeStock)) {
    throw new ApiError(400, 'This product is already in stock');
  }

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedSize = size || null;

  const existing = await StockNotification.findOne({
    productId,
    email: normalizedEmail,
    size: normalizedSize,
  });

  if (existing?.status === NOTIFICATION_STATUS.PENDING) {
    return { subscription: existing, alreadySubscribed: true };
  }

  if (existing?.status === NOTIFICATION_STATUS.NOTIFIED) {
    existing.status = NOTIFICATION_STATUS.PENDING;
    existing.notifiedAt = undefined;
    await existing.save();
    return { subscription: existing, alreadySubscribed: false };
  }

  try {
    const subscription = await StockNotification.create({
      productId,
      email: normalizedEmail,
      size: normalizedSize,
      userId: userId ?? undefined,
      status: NOTIFICATION_STATUS.PENDING,
    });

    return { subscription, alreadySubscribed: false };
  } catch (error) {
    if (error.code === 11000) {
      const duplicate = await StockNotification.findOne({
        productId,
        email: normalizedEmail,
        size: normalizedSize,
      });
      return { subscription: duplicate, alreadySubscribed: true };
    }
    throw error;
  }
};

const notifySubscriber = async (subscription, product) => {
  await sendBackInStockEmail({
    email: subscription.email,
    productName: product.name,
    productSlug: product.slug,
    size: subscription.size,
    price: product.sellingPrice,
  });

  subscription.status = NOTIFICATION_STATUS.NOTIFIED;
  subscription.notifiedAt = new Date();
  await subscription.save();
};

export const processRestockNotifications = async (productId, previousSizeStock = []) => {
  const product = await Product.findById(productId);
  if (!product) return { notified: 0 };

  const prevMap = new Map(previousSizeStock.map((s) => [s.size, s.stock ?? 0]));
  const restockedSizes = product.sizeStock
    .filter((item) => {
      const prev = prevMap.get(item.size) ?? 0;
      return prev <= 0 && item.stock > 0;
    })
    .map((item) => item.size);

  const wasFullySoldOut = previousSizeStock.length
    ? previousSizeStock.every((s) => (s.stock ?? 0) <= 0)
    : false;
  const nowFullyInStock = !isFullySoldOut(product.sizeStock);

  const orConditions = [];

  if (restockedSizes.length) {
    orConditions.push({ size: { $in: restockedSizes } });
  }

  if (wasFullySoldOut && nowFullyInStock) {
    orConditions.push({ size: null });
  }

  if (!orConditions.length) {
    return { notified: 0 };
  }

  const pending = await StockNotification.find({
    productId: product._id,
    status: NOTIFICATION_STATUS.PENDING,
    $or: orConditions,
  });

  let notified = 0;

  for (const subscription of pending) {
    if (subscription.size) {
      const sizeEntry = product.sizeStock.find((s) => s.size === subscription.size);
      if (!sizeEntry || sizeEntry.stock <= 0) continue;
    }

    await notifySubscriber(subscription, product);
    notified += 1;
  }

  return { notified };
};

export default {
  subscribeToStockNotification,
  processRestockNotifications,
};
