import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import SectionHeader from './SectionHeader';
import ProductCard from './ProductCard';
import Animate from './Animate';
import EmptyProductsState from '../common/EmptyProductsState';

const ProductGridSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="aspect-[3/4] bg-gray-200" />
        <div className="mt-4 h-4 w-3/4 bg-gray-200" />
        <div className="mt-2 h-3 w-1/2 bg-gray-200" />
      </div>
    ))}
  </div>
);

const ProductGrid = ({
  eyebrow,
  title,
  subtitle,
  products = [],
  loading = false,
  viewAllLink,
  emptyMessage,
  hideWhenEmpty = false,
}) => {
  if (!loading && hideWhenEmpty && products.length === 0) {
    return null;
  }

  return (
    <section className="py-14 sm:py-20">
      <div className="enugu-container">
        <Animate>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
            {viewAllLink && products.length > 0 && (
              <Link
                to={viewAllLink}
                className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-enugu-black underline-offset-4 transition hover:text-enugu-gold hover:underline"
              >
                View All
              </Link>
            )}
          </div>
        </Animate>

        {loading ? (
          <div className="mt-10">
            <ProductGridSkeleton />
          </div>
        ) : products.length === 0 ? (
          <div className="mt-10">
            <EmptyProductsState
              title="No products available yet"
              message={emptyMessage ?? 'New drops are on the way. Check back soon.'}
              showShopLink={false}
            />
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {products.map((product, index) => (
              <Animate key={product.id ?? product._id ?? product.slug} delay={index * 80}>
                <ProductCard product={product} index={index} />
              </Animate>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
