import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { catalogService } from '../../services/catalogService';
import { ROUTES } from '../../config/routes';
import { Seo } from '../../components/seo';
import { buildPageSeo } from '../../utils/seo';
import EmptyProductsState from '../../components/common/EmptyProductsState';

const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    catalogService
      .getCollections()
      .then(setCollections)
      .catch(() => setError('Unable to load collections'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Seo
        {...buildPageSeo({
          title: 'Collections',
          description: 'Explore ENUGU collections — curated categories of premium streetwear.',
          path: '/collections',
        })}
      />
      <div className="py-8 sm:py-12">
        <div className="enugu-container">
          <div className="mb-10 sm:mb-14">
            <p className="text-xs uppercase tracking-[0.3em] text-enugu-gold">Collections</p>
            <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-enugu-black sm:text-4xl">
              Shop by Collection
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
              Collections are built from categories you create in the admin dashboard. Each collection
              updates automatically when products are published.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-gray-200" />
                  <div className="mt-4 h-5 w-2/3 bg-gray-200" />
                </div>
              ))}
            </div>
          ) : collections.length === 0 ? (
            <EmptyProductsState
              title="No collections available yet"
              message="Collections appear when products are published under a category. Create categories and products in the admin dashboard."
              showShopLink
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {collections.map((collection) => (
                <Link
                  key={collection._id ?? collection.slug}
                  to={ROUTES.COLLECTION.replace(':slug', collection.slug)}
                  className="group block overflow-hidden border border-gray-100 bg-white transition hover:border-enugu-gold"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                    {collection.coverImage ? (
                      <img
                        src={collection.coverImage}
                        alt={collection.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        {collection.name}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-enugu-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <h2 className="font-display text-lg font-bold uppercase tracking-wide text-enugu-white sm:text-xl">
                        {collection.name}
                      </h2>
                      <p className="mt-1 text-xs uppercase tracking-wider text-enugu-gold">
                        {collection.productCount} {collection.productCount === 1 ? 'product' : 'products'}
                      </p>
                    </div>
                  </div>
                  {collection.description && (
                    <p className="p-4 text-sm text-gray-600 line-clamp-2">{collection.description}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CollectionsPage;
