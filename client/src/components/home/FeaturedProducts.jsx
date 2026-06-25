import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { catalogService } from '../../services/catalogService';
import { ROUTES } from '../../config/routes';
import SectionHeader from './SectionHeader';
import ProductCard from './ProductCard';
import Animate from './Animate';
import EmptyProductsState from '../common/EmptyProductsState';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    catalogService
      .getProducts({ isFeatured: 'true', limit: 4 })
      .then((result) => setProducts(result.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-14 sm:py-20">
      <div className="enugu-container">
        <Animate>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeader
              eyebrow="Curated"
              title="Featured Products"
              subtitle="Hand-picked pieces that define the ENUGU aesthetic."
            />
            {products.length > 0 && (
              <Link
                to={ROUTES.SHOP}
                className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-enugu-black underline-offset-4 transition hover:text-enugu-gold hover:underline"
              >
                View All
              </Link>
            )}
          </div>
        </Animate>

        {loading ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="mt-4 h-4 w-3/4 bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {products.map((product, index) => (
              <Animate key={product.id ?? product.slug} delay={index * 80}>
                <ProductCard product={product} index={index} />
              </Animate>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="mt-10">
            <EmptyProductsState showShopLink={false} />
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
