import { useSelector, useDispatch } from 'react-redux';
import {
  selectCheckout,
  setShippingAddress,
  setSelectedAddressId,
  setPaymentMethod,
  setAppliedCoupon,
  setPlacingOrder,
  resetCheckout,
} from '../store/slices/checkoutSlice';

export const useCheckout = () => {
  const dispatch = useDispatch();
  const checkout = useSelector(selectCheckout);

  return {
    ...checkout,
    setShippingAddress: (address) => dispatch(setShippingAddress(address)),
    setSelectedAddressId: (id) => dispatch(setSelectedAddressId(id)),
    setPaymentMethod: (method) => dispatch(setPaymentMethod(method)),
    setAppliedCoupon: (coupon) => dispatch(setAppliedCoupon(coupon)),
    setPlacingOrder: (value) => dispatch(setPlacingOrder(value)),
    reset: () => dispatch(resetCheckout()),
  };
};

export default useCheckout;
