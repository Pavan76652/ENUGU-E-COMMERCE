import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as couponService from '../../services/coupon.service.js';

export const listCoupons = asyncHandler(async (req, res) => {
  const result = await couponService.listCoupons(req.query);
  res.status(200).json(new ApiResponse(200, result.coupons, 'Coupons fetched', result.meta));
});

export const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.getCouponById(req.params.id);
  res.status(200).json(new ApiResponse(200, { coupon }, 'Coupon fetched'));
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.createCoupon(req.body, req.user, req);
  res.status(201).json(new ApiResponse(201, { coupon }, 'Coupon created'));
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.updateCoupon(req.params.id, req.body, req.user, req);
  res.status(200).json(new ApiResponse(200, { coupon }, 'Coupon updated'));
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.deleteCoupon(req.params.id, req.user, req);
  res.status(200).json(new ApiResponse(200, { coupon }, 'Coupon deactivated'));
});
