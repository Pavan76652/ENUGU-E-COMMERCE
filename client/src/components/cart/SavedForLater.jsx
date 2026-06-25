import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';

const SavedForLater = ({ items, onMoveToCart, onRemove }) => {
  if (!items.length) return null;

  return (
    <section className="mt-12 border-t border-gray-200 pt-10">
      <h2 className="font-display text-xl font-bold uppercase tracking-wide text-enugu-black">
        Saved for Later ({items.length})
      </h2>

      <div className="mt-6 divide-y divide-gray-100">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 py-5 sm:gap-6">
            <Link
              to={`/product/${item.slug}`}
              className="h-24 w-20 shrink-0 overflow-hidden bg-gray-100 sm:h-28 sm:w-24"
            >
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div>
                <Link
                  to={`/product/${item.slug}`}
                  className="font-display text-sm font-semibold uppercase tracking-wide text-enugu-black hover:text-enugu-gold"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-xs text-gray-500">
                  Size: {item.size} · Qty: {item.quantity}
                </p>
                <p className="mt-1 text-sm font-medium">{formatCurrency(item.price * item.quantity)}</p>
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => onMoveToCart(item.id)}
                  className="text-enugu-black transition hover:text-enugu-gold"
                >
                  Move to Cart
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="text-gray-500 transition hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SavedForLater;
