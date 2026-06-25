import { createSlice } from '@reduxjs/toolkit';
import { getStorageItem, setStorageItem } from '../../utils/storage';
import { normalizeWishlistProduct } from '../../services/wishlistApi';

const WISHLIST_KEY = 'enugu_wishlist';

const loadWishlist = () => getStorageItem(WISHLIST_KEY, []);

const saveWishlist = (items) => setStorageItem(WISHLIST_KEY, items);

const initialState = {
  items: loadWishlist(),
  isLoading: false,
  isSynced: false,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const product = normalizeWishlistProduct(action.payload);
      const exists = state.items.some((item) => item.id === product.id);

      if (!exists) {
        state.items.unshift(product);
        saveWishlist(state.items);
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      saveWishlist(state.items);
    },
    toggleWishlist: (state, action) => {
      const product = normalizeWishlistProduct(action.payload);
      const index = state.items.findIndex((item) => item.id === product.id);

      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.unshift(product);
      }

      saveWishlist(state.items);
    },
    setWishlistItems: (state, action) => {
      state.items = action.payload;
      saveWishlist(state.items);
    },
    setWishlistLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setWishlistSynced: (state, action) => {
      state.isSynced = action.payload;
    },
    clearWishlist: (state) => {
      state.items = [];
      state.isSynced = false;
      saveWishlist([]);
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  setWishlistItems,
  setWishlistLoading,
  setWishlistSynced,
  clearWishlist,
} = wishlistSlice.actions;

export const selectWishlist = (state) => state.wishlist;
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectIsInWishlist = (productId) => (state) =>
  state.wishlist.items.some(
    (item) => item.id === productId || item.productId === productId
  );

export default wishlistSlice.reducer;
