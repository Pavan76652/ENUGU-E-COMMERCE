import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';

const CartItem = ({ item, onUpdateQuantity, onRemove, onSaveForLater }) => (
  <div className="flex gap-4 border-b border-gray-100 py-6 sm:gap-6">
    <Link
      to={`/product/${item.slug}`}
      className="h-28 w-24 shrink-0 overflow-hidden bg-gray-100 sm:h-32 sm:w-28"
    >
      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
    </Link>

    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link
            to={`/product/${item.slug}`}
            className="font-display text-sm font-semibold uppercase tracking-wide text-enugu-black hover:text-enugu-gold sm:text-base"
          >
            {item.name}
          </Link>
          <p className="mt-1 text-xs text-gray-500">Size: {item.size}</p>
        </div>
        <p className="shrink-0 text-sm font-semibold text-enugu-black sm:text-base">
          {formatCurrency(item.price * item.quantity)}
        </p>
      </div>

      {item.mrp > item.price && (
        <p className="mt-1 text-xs text-gray-400 line-through">{formatCurrency(item.mrp)}</p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
        <div className="inline-flex items-center border border-gray-200">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="flex h-9 w-9 items-center justify-center text-sm transition hover:bg-gray-50 disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="flex h-9 w-10 items-center justify-center border-x border-gray-200 text-sm font-medium">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= 10}
            className="flex h-9 w-9 items-center justify-center text-sm transition hover:bg-gray-50 disabled:opacity-40"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs uppercase tracking-wider">
          <button
            type="button"
            onClick={() => onSaveForLater(item.id)}
            className="text-gray-500 transition hover:text-enugu-gold"
          >
            Save for Later
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
  </div>
);

export default CartItem;
