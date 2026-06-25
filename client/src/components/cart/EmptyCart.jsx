import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

const EmptyCart = () => (
  <div className="py-16 text-center sm:py-24">
    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
      <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    </div>
    <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-enugu-black">
      Your cart is empty
    </h2>
    <p className="mt-2 text-sm text-gray-500">
      Discover premium streetwear made to stand out.
    </p>
    <Link
      to={ROUTES.SHOP}
      className="mt-8 inline-block bg-enugu-black px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-enugu-white transition hover:bg-enugu-gold hover:text-enugu-black"
    >
      Continue Shopping
    </Link>
  </div>
);

export default EmptyCart;
