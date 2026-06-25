import { PAYMENT_METHODS } from '../../constants/paymentMethods.js';
import { ORDER_STATUS, PAYMENT_STATUS } from '../../constants/orderStatus.js';
import ApiError from '../../utils/ApiError.js';

/**
 * Payment provider interface — swap implementations when adding Razorpay.
 * Each provider must implement `processOrder(order)` after the order document is created.
 */
export const getPaymentProvider = (method) => {
  switch (method) {
    case PAYMENT_METHODS.COD:
      return codProvider;
    case PAYMENT_METHODS.RAZORPAY:
      return razorpayProvider;
    default:
      throw new ApiError(400, `Unsupported payment method: ${method}`);
  }
};

const codProvider = {
  method: PAYMENT_METHODS.COD,

  async processOrder(order) {
    order.status = ORDER_STATUS.CONFIRMED;
    order.paymentStatus = PAYMENT_STATUS.PENDING;
    order.statusHistory.push({
      status: ORDER_STATUS.CONFIRMED,
      note: 'COD order auto-confirmed',
      timestamp: new Date(),
    });
    await order.save();

    return {
      order,
      requiresClientAction: false,
      paymentMethod: PAYMENT_METHODS.COD,
    };
  },
};

const razorpayProvider = {
  method: PAYMENT_METHODS.RAZORPAY,

  async processOrder(order) {
    // Razorpay integration placeholder — order stays pending until payment is verified.
    order.status = ORDER_STATUS.PENDING;
    order.paymentStatus = PAYMENT_STATUS.PENDING;
    await order.save();

    return {
      order,
      requiresClientAction: true,
      paymentMethod: PAYMENT_METHODS.RAZORPAY,
      message: 'Razorpay payment flow not yet configured',
    };
  },
};

export default { getPaymentProvider };
