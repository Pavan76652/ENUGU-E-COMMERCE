import { createSlice } from '@reduxjs/toolkit';
import { PAYMENT_METHODS } from '../../constants/checkout';

const initialState = {
  step: 1,
  shippingAddress: null,
  selectedAddressId: null,
  paymentMethod: PAYMENT_METHODS.COD,
  appliedCoupon: null,
  orderSummary: null,
  isPlacingOrder: false,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCheckoutStep: (state, action) => {
      state.step = action.payload;
    },
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    setSelectedAddressId: (state, action) => {
      state.selectedAddressId = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    setAppliedCoupon: (state, action) => {
      state.appliedCoupon = action.payload;
    },
    setOrderSummary: (state, action) => {
      state.orderSummary = action.payload;
    },
    setPlacingOrder: (state, action) => {
      state.isPlacingOrder = action.payload;
    },
    resetCheckout: () => initialState,
  },
});

export const {
  setCheckoutStep,
  setShippingAddress,
  setSelectedAddressId,
  setPaymentMethod,
  setAppliedCoupon,
  setOrderSummary,
  setPlacingOrder,
  resetCheckout,
} = checkoutSlice.actions;

export const selectCheckout = (state) => state.checkout;

export default checkoutSlice.reducer;
