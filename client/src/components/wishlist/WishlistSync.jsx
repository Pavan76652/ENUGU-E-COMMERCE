import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { wishlistService } from '../../services/wishlistService';
import { getStorageItem } from '../../utils/storage';
import {
  setWishlistItems,
  setWishlistLoading,
  setWishlistSynced,
} from '../../store/slices/wishlistSlice';

const WISHLIST_KEY = 'enugu_wishlist';

/**
 * Merges guest wishlist into the account on login and loads server wishlist on refresh.
 */
const WishlistSync = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(setWishlistSynced(false));
      return undefined;
    }

    let cancelled = false;

    const sync = async () => {
      dispatch(setWishlistLoading(true));
      try {
        const guestItems = getStorageItem(WISHLIST_KEY, []);
        const items =
          guestItems.length > 0
            ? await wishlistService.syncLocalItems(guestItems)
            : await wishlistService.fetch();

        if (!cancelled && items) {
          dispatch(setWishlistItems(items));
          dispatch(setWishlistSynced(true));
        }
      } finally {
        if (!cancelled) dispatch(setWishlistLoading(false));
      }
    };

    sync();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, dispatch]);

  return null;
};

export default WishlistSync;
