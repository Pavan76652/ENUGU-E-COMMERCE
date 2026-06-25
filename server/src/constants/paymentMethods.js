export const PAYMENT_METHODS = Object.freeze({
  COD: 'cod',
  RAZORPAY: 'razorpay',
});

export const ALL_PAYMENT_METHODS = Object.freeze(Object.values(PAYMENT_METHODS));

export const PAYMENT_METHOD_LABELS = Object.freeze({
  [PAYMENT_METHODS.COD]: 'Cash on Delivery',
  [PAYMENT_METHODS.RAZORPAY]: 'Pay Online (Razorpay)',
});

export default PAYMENT_METHODS;
