import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleWishlist,
  removeFromWishlist,
  setWishlistItems,
  setWishlistLoading,
  selectIsInWishlist,
  selectWishlistItems,
  selectWishlistCount,
} from '../store/slices/wishlistSlice';
import { useAuth } from './useAuth';
import { wishlistService } from '../services/wishlistService';
import { normalizeWishlistProduct } from '../services/wishlistApi';

export const useWishlist = (productId) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const isInWishlist = useSelector(
    productId ? selectIsInWishlist(productId) : () => false
  );
  const items = useSelector(selectWishlistItems);
  const count = useSelector(selectWishlistCount);

  const toggle = useCallback(
    async (product) => {
      const normalized = normalizeWishlistProduct(product);
      const currentlyIn = items.some((item) => item.id === normalized.id);

      if (isAuthenticated) {
        dispatch(setWishlistLoading(true));
        try {
          const updated = currentlyIn
            ? await wishlistService.remove(normalized.id)
            : await wishlistService.add(product);
          if (updated) dispatch(setWishlistItems(updated));
        } catch {
          dispatch(toggleWishlist(product));
        } finally {
          dispatch(setWishlistLoading(false));
        }
      } else {
        dispatch(toggleWishlist(product));
      }
    },
    [dispatch, isAuthenticated, items]
  );

  const remove = useCallback(
    async (id) => {
      if (isAuthenticated) {
        dispatch(setWishlistLoading(true));
        try {
          const updated = await wishlistService.remove(id);
          if (updated) dispatch(setWishlistItems(updated));
        } catch {
          dispatch(removeFromWishlist(id));
        } finally {
          dispatch(setWishlistLoading(false));
        }
      } else {
        dispatch(removeFromWishlist(id));
      }
    },
    [dispatch, isAuthenticated]
  );

  return {
    isInWishlist: productId ? isInWishlist : undefined,
    items,
    count,
    toggle,
    remove,
  };
};

export default useWishlist;
