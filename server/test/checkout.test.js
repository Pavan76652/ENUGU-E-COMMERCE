import { describe, it, expect } from 'vitest';
import * as checkoutService from '../src/services/checkout.service.js';
import { updateOrderStatus } from '../src/services/order.service.js';
import Product from '../src/models/Product.js';
import { ORDER_STATUS } from '../src/constants/orderStatus.js';
import { createProduct, createUser, toAuthUser, sampleShippingAddress } from './helpers.js';

const getSizeStock = (product, size) =>
  product.sizeStock.find((s) => s.size === size)?.stock ?? 0;

describe('Checkout service', () => {
  it('creates an order and atomically decrements stock', async () => {
    const product = await createProduct({ sizeStock: defaultStock(5) });
    const user = await createUser();

    const result = await checkoutService.createOrder(toAuthUser(user), {
      items: [{ productId: product._id.toString(), size: 'M', quantity: 2 }],
      shippingAddress: sampleShippingAddress(),
    });

    expect(result.order.orderNumber).toBeTruthy();
    expect(result.order.status).toBe(ORDER_STATUS.CONFIRMED);

    const updated = await Product.findById(product._id);
    expect(getSizeStock(updated, 'M')).toBe(3);
  });

  it('prevents overselling when quantity exceeds stock', async () => {
    const product = await createProduct({ sizeStock: defaultStock(1) });
    const user = await createUser();

    await expect(
      checkoutService.createOrder(toAuthUser(user), {
        items: [{ productId: product._id.toString(), size: 'M', quantity: 5 }],
        shippingAddress: sampleShippingAddress(),
      })
    ).rejects.toThrow();

    const updated = await Product.findById(product._id);
    expect(getSizeStock(updated, 'M')).toBe(1);
  });

  it('restores stock when an order is cancelled', async () => {
    const product = await createProduct({ sizeStock: defaultStock(5) });
    const user = await createUser();
    const actor = toAuthUser(user);

    const result = await checkoutService.createOrder(actor, {
      items: [{ productId: product._id.toString(), size: 'L', quantity: 3 }],
      shippingAddress: sampleShippingAddress(),
    });

    expect(getSizeStock(await Product.findById(product._id), 'L')).toBe(2);

    await updateOrderStatus(
      result.order.orderNumber,
      { status: ORDER_STATUS.CANCELLED, note: 'test cancel' },
      actor
    );

    expect(getSizeStock(await Product.findById(product._id), 'L')).toBe(5);
  });
});

function defaultStock(qty) {
  return ['S', 'M', 'L', 'XL', 'XXL'].map((size) => ({ size, stock: qty }));
}
