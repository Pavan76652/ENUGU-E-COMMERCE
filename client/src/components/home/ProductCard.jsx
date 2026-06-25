import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/helpers';
import { ROUTES } from '../../config/routes';
import { getCoverImage } from '../../utils/productUtils';
import { addToCart, selectIsProductInCart } from '../../store/slices/cartSlice';
import { useWishlist } from '../../hooks/useWishlist';

const ProductCard = ({ product, index = 0 }) => {
  const dispatch = useDispatch();
  const { isInWishlist, toggle } = useWishlist(product.id);
  const isInCart = useSelector(selectIsProductInCart(product.id));
  const price = product.sellingPrice ?? product.price ?? 0;
  const mrp = product.mrp ?? price;
  const discount = product.discountPercentage ?? Math.round(((mrp - price) / mrp) * 100);
  const image = product.image ?? getCoverImage(product);
  const soldOut = product.inventory?.isSoldOut || product.status === 'sold_out';
  const badge = product.badge
    || (product.isNewArrival && 'New')
    || (product.isFeatured && 'Featured')
    || (soldOut && 'Sold Out')
    || null;
  const firstAvailableSize =
    product.inventory?.sizeStock?.find((size) => size.inStock || (size.stock ?? 0) > 0)?.size ?? 'M';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image,
        size: firstAvailableSize,
        price,
        mrp,
        quantity: 1,
      })
    );
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  };

  return (
    <div
      className="group block"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">No image</div>
        )}
        {badge && (
          <span className="absolute left-3 top-3 bg-enugu-black px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-enugu-white">
            {badge}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-enugu-black/90 py-3 text-center transition-transform duration-300 group-hover:translate-y-0">
          <span className="text-xs uppercase tracking-[0.2em] text-enugu-white">Quick View</span>
        </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium uppercase tracking-wide text-enugu-black transition group-hover:text-enugu-gold">
            {product.name}
          </h3>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-sm font-semibold text-enugu-black">{formatCurrency(price)}</span>
            {mrp > price && (
              <span className="text-xs text-gray-400 line-through">{formatCurrency(mrp)}</span>
            )}
            {discount > 0 && (
              <span className="text-[10px] font-medium uppercase tracking-wider text-enugu-gold">
                -{discount}%
              </span>
            )}
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
      {!soldOut && (
        <div className="mt-3">
          {isInCart ? (
            <Link
              to={ROUTES.CART}
              className="block border border-enugu-black px-3 py-2 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-enugu-black transition hover:bg-enugu-black hover:text-white"
            >
              Added To Cart ✓
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
      )}
    </div>
  );
};

export default ProductCard;
