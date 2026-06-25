import { useSelector, useDispatch } from 'react-redux';
import {
  selectCart,
  selectCartCount,
  selectCartItems,
  selectSavedForLater,
  updateCartQuantity,
  removeFromCart,
  saveForLater,
  moveToCart,
  removeSavedItem,
  clearCart,
} from '../store/slices/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const items = useSelector(selectCartItems);
  const savedForLater = useSelector(selectSavedForLater);
  const itemCount = useSelector(selectCartCount);

  return {
    ...cart,
    items,
    savedForLater,
    itemCount,
    updateQuantity: (id, quantity) => dispatch(updateCartQuantity({ id, quantity })),
    removeItem: (id) => dispatch(removeFromCart(id)),
    saveItemForLater: (id) => dispatch(saveForLater(id)),
    moveItemToCart: (id) => dispatch(moveToCart(id)),
    removeSaved: (id) => dispatch(removeSavedItem(id)),
    clear: () => dispatch(clearCart()),
  };
};

export default useCart;
