import { Link } from 'react-router-dom';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import { WishlistItem, EmptyWishlist } from '../../components/wishlist';
import { ROUTES } from '../../config/routes';

const WishlistPage = () => {
  const { items, remove, count } = useWishlist();
  const { isAuthenticated } = useAuth();

  return (
    <div className="py-8 sm:py-12">
      <div className="enugu-container">
        <div className="mb-8 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-enugu-gold">Account</p>
          <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-enugu-black sm:text-4xl">
            My Wishlist
          </h1>
          {count > 0 && (
            <p className="mt-2 text-sm text-gray-500">{count} saved items</p>
          )}
          {!isAuthenticated && count > 0 && (
            <p className="mt-2 text-sm text-enugu-gold">
              <Link to={ROUTES.LOGIN} className="underline underline-offset-2">
                Sign in
              </Link>{' '}
              to sync your wishlist across devices.
            </p>
          )}
        </div>

        {count === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="mx-auto max-w-4xl">
            {items.map((item) => (
              <WishlistItem key={item.id} item={item} onRemove={remove} />
            ))}
            <Link
              to={ROUTES.SHOP}
              className="mt-8 inline-block text-xs uppercase tracking-[0.2em] text-gray-500 transition hover:text-enugu-gold"
            >
              ← Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
