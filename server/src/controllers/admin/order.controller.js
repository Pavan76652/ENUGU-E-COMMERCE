import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as orderService from '../../services/order.service.js';

export const listOrders = asyncHandler(async (req, res) => {
  const result = await orderService.listOrders(req.query);
  res.status(200).json(new ApiResponse(200, result.orders, 'Orders fetched', result.meta));
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderByNumber(req.params.orderNumber);
  res.status(200).json(new ApiResponse(200, { order }, 'Order fetched'));
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(
    req.params.orderNumber,
    req.body,
    req.user,
    req
  );
  res.status(200).json(new ApiResponse(200, { order }, 'Order status updated'));
});

export const updateOrderTracking = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderTracking(
    req.params.orderNumber,
    req.body,
    req.user,
    req
  );
  res.status(200).json(new ApiResponse(200, { order }, 'Tracking updated'));
});

export const updateOrderNotes = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderNotes(
    req.params.orderNumber,
    req.body,
    req.user,
    req
  );
  res.status(200).json(new ApiResponse(200, { order }, 'Order notes updated'));
});
