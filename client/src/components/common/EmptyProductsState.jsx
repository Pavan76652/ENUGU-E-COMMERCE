import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

const EmptyProductsState = ({
  title = 'No products available yet',
  message = 'We are preparing new drops. Check back soon or explore our collections.',
  showShopLink = true,
  className = '',
}) => (
  <div
    className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center ${className}`}
  >
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-enugu-black/5">
      <svg className="h-7 w-7 text-enugu-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    </div>
    <h3 className="font-display text-lg font-bold uppercase tracking-wide text-enugu-black">{title}</h3>
    <p className="mt-2 max-w-sm text-sm text-gray-500">{message}</p>
    {showShopLink && (
      <Link
        to={ROUTES.SHOP}
        className="enugu-btn-primary mt-6 inline-flex px-8 py-3 text-xs"
      >
        Browse Shop
      </Link>
    )}
  </div>
);

export default EmptyProductsState;
