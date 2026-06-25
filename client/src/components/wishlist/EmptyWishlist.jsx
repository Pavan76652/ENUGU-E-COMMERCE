import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

const EmptyWishlist = () => (
  <div className="py-16 text-center sm:py-24">
    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
      <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </div>
    <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-enugu-black">
      Your wishlist is empty
    </h2>
    <p className="mt-2 text-sm text-gray-500">Save pieces you love and come back anytime.</p>
    <Link
      to={ROUTES.SHOP}
      className="mt-8 inline-block bg-enugu-black px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-enugu-white transition hover:bg-enugu-gold hover:text-enugu-black"
    >
      Explore Shop
    </Link>
  </div>
);

export default EmptyWishlist;
