export const PAYMENT_METHODS = {
  COD: 'cod',
  RAZORPAY: 'razorpay',
};

export const PAYMENT_METHOD_OPTIONS = [
  {
    id: PAYMENT_METHODS.COD,
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    available: true,
  },
  {
    id: PAYMENT_METHODS.RAZORPAY,
    label: 'Pay Online',
    description: 'UPI, Cards, Net Banking via Razorpay',
    available: false,
    badge: 'Coming Soon',
  },
];

export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const SHIPPING_FLAT_RATE = 99;

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
];

export default PAYMENT_METHODS;
