import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as checkoutService from '../../services/checkout.service.js';
import { validateCouponForCheckout } from '../../services/storefrontCoupon.service.js';

export const previewCheckout = asyncHandler(async (req, res) => {
  const result = await checkoutService.previewCheckout({
    ...req.body,
    userId: req.user?.id,
  });

  res.status(200).json(new ApiResponse(200, result, 'Checkout preview'));
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;

  const coupon = await validateCouponForCheckout({
    code,
    subtotal,
    userId: req.user?.id,
  });

  res.status(200).json(new ApiResponse(200, { coupon }, 'Coupon applied'));
});

export const createOrder = asyncHandler(async (req, res) => {
  const result = await checkoutService.createOrder(req.user, req.body);

  res.status(201).json(
    new ApiResponse(201, {
      order: result.order,
      requiresClientAction: result.requiresClientAction,
      paymentMethod: result.paymentMethod,
      message: result.message,
    }, 'Order placed successfully')
  );
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const result = await checkoutService.getMyOrders(req.user.id, req.query);
  res.status(200).json(new ApiResponse(200, result.orders, 'Orders fetched', result.meta));
});

export const getMyOrderByNumber = asyncHandler(async (req, res) => {
  const order = await checkoutService.getMyOrderByNumber(
    req.user.id,
    req.params.orderNumber
  );
  res.status(200).json(new ApiResponse(200, { order }, 'Order fetched'));
});
