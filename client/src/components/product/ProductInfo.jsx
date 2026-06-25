import { useState } from 'react';
import SizeSelector from './SizeSelector';
import SizeGuideModal from './SizeGuideModal';
import QuantitySelector from './QuantitySelector';
import ProductReviews from './ProductReviews';
import RelatedProducts from './RelatedProducts';
import NotifyMe from './NotifyMe';
import { formatCurrency } from '../../utils/helpers';
import { ROUTES } from '../../config/routes';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectIsProductInCart, selectIsProductSizeInCart } from '../../store/slices/cartSlice';
import { useWishlist } from '../../hooks/useWishlist';

const ProductInfo = ({ product, reviews, related }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isInWishlist, toggle } = useWishlist(product.id);
  const isProductInCart = useSelector(selectIsProductInCart(product.id));

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const sizeGuide =
    product.sizeGuide ??
    (product.sizeGuideId && typeof product.sizeGuideId === 'object' ? product.sizeGuideId : null);

  const hasSizeGuide = Boolean(sizeGuide);

  const price = product.sellingPrice ?? product.price;
  const soldOut = product.inventory?.isSoldOut || product.status === 'sold_out';
  const sizeStock = product.inventory?.sizeStock ?? product.sizeStock ?? [];
  const selectedSizeItem = selectedSize ? sizeStock.find((s) => s.size === selectedSize) : null;
  const isSelectedSizeInCart = useSelector(
    selectedSize ? selectIsProductSizeInCart(product.id, selectedSize) : () => false
  );
  const selectedSizeSoldOut = Boolean(
    selectedSizeItem && (selectedSizeItem.stock ?? 0) <= 0 && !selectedSizeItem.inStock
  );

  const handleAddToCart = (redirect = false) => {
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
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        size: selectedSize,
        price,
        mrp: product.mrp,
        quantity,
      })
    );

    if (redirect) {
      navigate(ROUTES.CHECKOUT);
    }
  };

  return (
    <div className="lg:col-span-5">
      <nav className="mb-4 text-xs text-gray-400">
        <Link to={ROUTES.HOME} className="hover:text-enugu-gold">Home</Link>
        <span className="mx-2">/</span>
        <Link to={ROUTES.SHOP} className="hover:text-enugu-gold">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-enugu-black">{product.name}</span>
      </nav>

      {product.categoryId?.name && (
        <p className="text-xs uppercase tracking-[0.3em] text-enugu-gold">{product.categoryId.name}</p>
      )}

      <div className="mt-2 flex items-start justify-between gap-4">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-enugu-black sm:text-4xl">
          {product.name}
        </h1>
        <button
          type="button"
          onClick={() => toggle(product)}
          aria-label="Toggle wishlist"
          className={`shrink-0 p-2 transition ${isInWishlist ? 'text-enugu-gold' : 'text-gray-400 hover:text-enugu-gold'}`}
        >
          <svg className="h-6 w-6" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-2xl font-semibold text-enugu-black">{formatCurrency(price)}</span>
        <span className="text-base text-gray-400 line-through">{formatCurrency(product.mrp)}</span>
        {product.discountPercentage > 0 && (
          <span className="bg-enugu-gold/20 px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-enugu-gold">
            {product.discountPercentage}% OFF
          </span>
        )}
      </div>

      {soldOut ? (
        <p className="mt-4 text-sm font-medium uppercase tracking-widest text-red-600">Sold Out</p>
      ) : (
        <p className="mt-2 text-sm text-gray-500">Free shipping on orders above ₹999</p>
      )}

      {soldOut && (
        <div className="mt-6">
          <NotifyMe productId={product.id} productName={product.name} />
        </div>
      )}

      {!soldOut && (
      <div className="mt-8 space-y-6">
        <SizeSelector
          sizes={sizeStock}
          selected={selectedSize}
          hasSizeGuide={hasSizeGuide}
          onSizeGuideClick={() => setSizeGuideOpen(true)}
          onSelect={(size) => {
            setSelectedSize(size);
            setError('');
          }}
        />

        <SizeGuideModal
          isOpen={sizeGuideOpen}
          onClose={() => setSizeGuideOpen(false)}
          sizeGuide={sizeGuide}
        />

        {selectedSizeSoldOut && (
          <NotifyMe
            productId={product.id}
            productName={product.name}
            size={selectedSize}
            compact
          />
        )}

        <QuantitySelector quantity={quantity} onChange={setQuantity} max={10} disabled={selectedSizeSoldOut} />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex flex-col gap-3 sm:flex-row">
          {isProductInCart || isSelectedSizeInCart ? (
            <Link
              to={ROUTES.CART}
              className="enugu-btn-outline flex-1 py-3 text-center"
            >
              In Cart ✓
            </Link>
          ) : (
            <button
              type="button"
              disabled={selectedSizeSoldOut}
              onClick={() => handleAddToCart(false)}
              className="enugu-btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add to Cart
            </button>
          )}
          <button
            type="button"
            disabled={selectedSizeSoldOut}
            onClick={() => handleAddToCart(true)}
            className="enugu-btn-outline flex-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Buy Now
          </button>
        </div>

        {!selectedSize && sizeStock.some((s) => (s.stock ?? 0) <= 0) && (
          <p className="text-xs text-gray-500">Select an out-of-stock size to get notified when it returns.</p>
        )}
      </div>
      )}

      <div className="mt-10 border-t border-gray-100 pt-8">
        <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-enugu-black">Description</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{product.description}</p>
      </div>

      <ProductReviews reviews={reviews} rating={product.averageRating} count={product.reviewCount} />
      <RelatedProducts products={related} />
    </div>
  );
};

export default ProductInfo;
