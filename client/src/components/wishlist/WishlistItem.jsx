import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { formatCurrency } from '../../utils/helpers';
import { ROUTES } from '../../config/routes';
import { addToCart } from '../../store/slices/cartSlice';
import SizeSelector from '../product/SizeSelector';

const WishlistItem = ({ item, onRemove }) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState('');
  const [error, setError] = useState('');

  const price = item.price ?? item.sellingPrice;
  const soldOut = item.inventory?.isSoldOut || item.status === 'sold_out';
  const sizeStock = item.inventory?.sizeStock ?? [];
  const discount =
    item.discountPercentage ??
    (item.mrp > price ? Math.round(((item.mrp - price) / item.mrp) * 100) : 0);

  const handleMoveToCart = () => {
    if (!selectedSize) {
      setError('Please select a size');
      return;
    }

    const sizeItem = sizeStock.find((s) => s.size === selectedSize);
    if (!sizeItem?.inStock && sizeItem?.stock <= 0) {
      setError('Selected size is out of stock');
      return;
    }

    setError('');
    dispatch(
      addToCart({
        productId: item.id,
        slug: item.slug,
        name: item.name,
        image: item.image,
        size: selectedSize,
        price,
        mrp: item.mrp,
        quantity: 1,
      })
    );
    onRemove(item.id);
  };

  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 py-6 sm:flex-row sm:gap-6">
      <Link
        to={`/product/${item.slug}`}
        className="h-36 w-28 shrink-0 overflow-hidden bg-gray-100 sm:h-40 sm:w-32"
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
            {soldOut && (
              <span className="mt-1 inline-block bg-enugu-black px-2 py-0.5 text-[10px] uppercase tracking-wider text-white">
                Sold Out
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-enugu-black sm:text-base">
              {formatCurrency(price)}
            </p>
            {item.mrp > price && (
              <p className="text-xs text-gray-400 line-through">{formatCurrency(item.mrp)}</p>
            )}
            {discount > 0 && (
              <p className="text-xs text-enugu-gold">-{discount}%</p>
            )}
          </div>
        </div>

        {!soldOut && sizeStock.length > 0 && (
          <div className="mt-4">
            <SizeSelector
              sizes={sizeStock}
              selected={selectedSize}
              onSelect={setSelectedSize}
            />
          </div>
        )}

        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

        <div className="mt-auto flex flex-wrap items-center gap-4 pt-4 text-xs uppercase tracking-wider">
          {!soldOut && (
            <button
              type="button"
              onClick={handleMoveToCart}
              className="bg-enugu-black px-4 py-2.5 text-enugu-white transition hover:bg-enugu-gold hover:text-enugu-black"
            >
              Move to Cart
            </button>
          )}
          <Link
            to={`/product/${item.slug}`}
            className="text-gray-500 transition hover:text-enugu-gold"
          >
            View Product
          </Link>
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
  );
};

export default WishlistItem;
