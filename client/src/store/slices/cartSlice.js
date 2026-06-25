import { createSlice } from '@reduxjs/toolkit';
import { getStorageItem, setStorageItem } from '../../utils/storage';

const CART_KEY = 'enugu_cart_items';
const SAVED_KEY = 'enugu_saved_items';

const loadCart = () => getStorageItem(CART_KEY, []);
const loadSaved = () => getStorageItem(SAVED_KEY, []);

const saveCart = (items) => setStorageItem(CART_KEY, items);
const saveSaved = (items) => setStorageItem(SAVED_KEY, items);

const initialState = {
  items: loadCart(),
  savedForLater: loadSaved(),
  couponCode: null,
  isOpen: false,
  isLoading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, slug, name, image, size, price, mrp, quantity = 1 } = action.payload;
      const existing = state.items.find(
        (item) => item.productId === productId && item.size === size
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          id: `${productId}-${size}`,
          productId,
          slug,
          name,
          image,
          size,
          price,
          mrp,
          quantity,
        });
      }

      state.savedForLater = state.savedForLater.filter(
        (item) => !(item.productId === productId && item.size === size)
      );
      saveCart(state.items);
      saveSaved(state.savedForLater);
    },
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = Math.max(1, Math.min(10, quantity));
        saveCart(state.items);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCart(state.items);
    },
    saveForLater: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;

      state.items = state.items.filter((i) => i.id !== action.payload);
      const exists = state.savedForLater.find((i) => i.id === item.id);
      if (!exists) {
        state.savedForLater.push(item);
      }
      saveCart(state.items);
      saveSaved(state.savedForLater);
    },
    moveToCart: (state, action) => {
      const item = state.savedForLater.find((i) => i.id === action.payload);
      if (!item) return;

      state.savedForLater = state.savedForLater.filter((i) => i.id !== action.payload);
      const existing = state.items.find(
        (i) => i.productId === item.productId && i.size === item.size
      );

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
      saveCart(state.items);
      saveSaved(state.savedForLater);
    },
    removeSavedItem: (state, action) => {
      state.savedForLater = state.savedForLater.filter((item) => item.id !== action.payload);
      saveSaved(state.savedForLater);
    },
    setCartItems: (state, action) => {
      state.items = action.payload;
      saveCart(state.items);
    },
    setCartOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    setCouponCode: (state, action) => {
      state.couponCode = action.payload;
    },
    setCartLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.couponCode = null;
      saveCart([]);
    },
  },
});

export const {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  saveForLater,
  moveToCart,
  removeSavedItem,
  setCartItems,
  setCartOpen,
  setCouponCode,
  setCartLoading,
  clearCart,
} = cartSlice.actions;

export const selectCart = (state) => state.cart;
export const selectCartItems = (state) => state.cart.items;
export const selectSavedForLater = (state) => state.cart.savedForLater;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectIsProductInCart = (productId) => (state) =>
  state.cart.items.some((item) => item.productId === productId);
export const selectIsProductSizeInCart = (productId, size) => (state) =>
  state.cart.items.some((item) => item.productId === productId && item.size === size);

export default cartSlice.reducer;
