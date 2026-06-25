import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import { isFullySoldOut } from '../utils/productHelpers.js';
import { PRODUCT_STATUS } from '../constants/productStatus.js';

/**
 * Atomically decrements stock for each cart item. The conditional update guard
 * (`stock >= quantity`) prevents overselling even under concurrent checkouts.
 * Throws if any item no longer has sufficient stock.
 */
export const decrementStock = async (items, session = null) => {
  for (const item of items) {
    const result = await Product.updateOne(
      {
        _id: item.productId,
        sizeStock: { $elemMatch: { size: item.size, stock: { $gte: item.quantity } } },
      },
      { $inc: { 'sizeStock.$.stock': -item.quantity } },
      { session }
    );

    if (result.modifiedCount === 0) {
      throw new ApiError(409, `Insufficient stock for ${item.name ?? 'item'} (${item.size})`);
    }
  }

  await syncProductStatuses(items.map((item) => item.productId), session);
};

/**
 * Restores stock for the items of a cancelled/returned order.
 */
export const restoreStock = async (items, session = null) => {
  for (const item of items) {
    await Product.updateOne(
      { _id: item.productId, 'sizeStock.size': item.size },
      { $inc: { 'sizeStock.$.stock': item.quantity } },
      { session }
    );
  }

  await syncProductStatuses(items.map((item) => item.productId), session);
};

/**
 * Recomputes `status` (sold_out / published) after stock changes made via `$inc`,
 * which bypass document-level hooks.
 */
const syncProductStatuses = async (productIds, session = null) => {
  const uniqueIds = [...new Set(productIds.map((id) => String(id)))];
  const products = await Product.find({ _id: { $in: uniqueIds } }).session(session);

  for (const product of products) {
    if (
      product.status === PRODUCT_STATUS.ARCHIVED ||
      product.status === PRODUCT_STATUS.DRAFT
    ) {
      continue;
    }

    const soldOut = isFullySoldOut(product.sizeStock);
    let nextStatus = product.status;

    if (soldOut) {
      nextStatus = PRODUCT_STATUS.SOLD_OUT;
    } else if (product.status === PRODUCT_STATUS.SOLD_OUT) {
      nextStatus = PRODUCT_STATUS.PUBLISHED;
    }

    if (nextStatus !== product.status) {
      await Product.updateOne({ _id: product._id }, { status: nextStatus }, { session });
    }
  }
};

export default { decrementStock, restoreStock };
