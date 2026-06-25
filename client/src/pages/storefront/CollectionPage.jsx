import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { catalogService } from '../../services/catalogService';
import ShopProductCard from '../../components/shop/ShopProductCard';
import { Seo } from '../../components/seo';
import { buildPageSeo } from '../../utils/seo';
import { ROUTES } from '../../config/routes';
import EmptyProductsState from '../../components/common/EmptyProductsState';

const CollectionPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    catalogService
      .getCollectionBySlug(slug, { limit: 48 })
      .then((result) => {
        setCategory(result.category);
        setProducts(result.products);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="enugu-container py-12">
        <div className="mb-8 h-10 w-1/3 animate-pulse bg-gray-200" />
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-200" />
              <div className="mt-4 h-4 w-3/4 bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !category) {
    return (
      <div className="enugu-container py-16">
        <EmptyProductsState
          title="Collection not found"
          message="This collection may be empty or no longer available."
          showShopLink
        />
        <div className="mt-6 text-center">
          <Link
            to={ROUTES.COLLECTIONS}
            className="text-xs font-medium uppercase tracking-wider text-enugu-gold hover:underline"
          >
            ← All collections
          </Link>
        </div>
      </div>
    );
  }

  const seo = buildPageSeo({
    title: `${category.name} Collection`,
    description: category.description || `Shop the ${category.name} collection at ENUGU.`,
    path: `/collections/${slug}`,
    image: products[0]?.image,
  });

  return (
    <>
      <Seo {...seo} />
      <div className="py-8 sm:py-12">
        <div className="enugu-container">
          <Link
            to={ROUTES.COLLECTIONS}
            className="text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-enugu-gold"
          >
            ← All collections
          </Link>
          <div className="mb-8 mt-4 sm:mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-enugu-gold">Collection</p>
            <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-enugu-black sm:text-4xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">{category.description}</p>
            )}
            <p className="mt-2 text-xs uppercase tracking-wider text-gray-400">
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          {products.length === 0 ? (
            <EmptyProductsState showShopLink />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {products.map((product) => (
                <ShopProductCard key={product.id ?? product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CollectionPage;
