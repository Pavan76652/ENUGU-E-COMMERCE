import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/helpers';
import { ROUTES } from '../../config/routes';
import { addToCart, selectIsProductInCart } from '../../store/slices/cartSlice';
import { useWishlist } from '../../hooks/useWishlist';

const ShopProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isInWishlist, toggle } = useWishlist(product.id);
  const isInCart = useSelector(selectIsProductInCart(product.id));
  const price = product.sellingPrice ?? product.price;
  const discount = product.discountPercentage ?? Math.round(((product.mrp - price) / product.mrp) * 100);
  const soldOut = product.inventory?.isSoldOut || product.status === 'sold_out';
  const firstAvailableSize =
    product.inventory?.sizeStock?.find((size) => size.inStock || (size.stock ?? 0) > 0)?.size ?? 'M';

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        size: firstAvailableSize,
        price,
        mrp: product.mrp,
        quantity: 1,
      })
    );
  };

  return (
    <div className="group relative flex h-full flex-col">
      <Link to={`/product/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
              soldOut ? 'opacity-70' : ''
            }`}
          />

          {soldOut && (
            <span className="absolute left-3 top-3 bg-enugu-black px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-enugu-white">
              Sold Out
            </span>
          )}

          {!soldOut && product.badge && (
            <span className="absolute left-3 top-3 bg-enugu-gold px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-enugu-black">
              {product.badge}
            </span>
          )}

          {discount > 0 && !soldOut && (
            <span className="absolute right-3 top-3 bg-enugu-black px-2 py-1 text-[10px] font-bold text-enugu-white">
              -{discount}%
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-enugu-black/90 py-3 text-center transition-transform duration-300 group-hover:translate-y-0">
            <span className="text-xs uppercase tracking-[0.2em] text-enugu-white">View Product</span>
          </div>
        </div>

        <div className="mt-4 flex flex-1 flex-col">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium uppercase tracking-wide text-enugu-black transition group-hover:text-enugu-gold">
            {product.name}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-enugu-black">{formatCurrency(price)}</span>
            <span className="text-xs text-gray-400 line-through">{formatCurrency(product.mrp)}</span>
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={handleWishlist}
        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full transition ${
          isInWishlist
            ? 'bg-enugu-gold text-enugu-black'
            : 'bg-enugu-white/90 text-enugu-black hover:bg-enugu-gold'
        }`}
      >
        <svg className="h-4 w-4" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <div className="mt-3">
        {soldOut ? (
          <span className="block w-full cursor-not-allowed border border-gray-300 px-3 py-2 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">
            Sold Out
          </span>
        ) : isInCart ? (
          <Link
            to={ROUTES.CART}
            className="block w-full border border-enugu-black px-3 py-2 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-enugu-black transition hover:bg-enugu-black hover:text-white"
          >
            Go To Cart
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full bg-enugu-black px-3 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-enugu-gold hover:text-enugu-black"
          >
            Add To Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ShopProductCard;
