import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catalogService } from '../../services/catalogService';
import ShopSearch from '../../components/shop/ShopSearch';
import ShopFilters from '../../components/shop/ShopFilters';
import ShopSort from '../../components/shop/ShopSort';
import ShopProductCard from '../../components/shop/ShopProductCard';
import { Seo } from '../../components/seo';
import { PAGE_SEO } from '../../utils/seo';
import { useDebounce } from '../../hooks/useDebounce';

import EmptyProductsState from '../../components/common/EmptyProductsState';

const defaultFilters = {  search: '',
  category: '',
  minPrice: null,
  maxPrice: null,
  size: '',
  availability: '',
  sort: 'newest',
};

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    ...defaultFilters,
    search: searchParams.get('search') ?? '',
    category: searchParams.get('category') ?? '',
    size: searchParams.get('size') ?? '',
    availability: searchParams.get('availability') ?? '',
    sort: searchParams.get('sort') ?? 'newest',
  });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const debouncedSearch = useDebounce(filters.search, 300);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await catalogService.getProducts({
        search: debouncedSearch || undefined,
        category: filters.category || undefined,
        minPrice: filters.minPrice ?? undefined,
        maxPrice: filters.maxPrice ?? undefined,
        size: filters.size || undefined,
        availability: filters.availability || undefined,
        sort: filters.sort,
      });
      setProducts(result.products);
    } catch {
      setProducts([]);
      setError('Unable to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters]);
  useEffect(() => {
    catalogService.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.size) params.set('size', filters.size);
    if (filters.availability) params.set('availability', filters.availability);
    if (filters.sort !== 'newest') params.set('sort', filters.sort);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const updateFilters = (patch) => setFilters((prev) => ({ ...prev, ...patch }));

  const resetFilters = () => setFilters(defaultFilters);

  return (
    <>
      <Seo {...PAGE_SEO.shop} />
    <div className="py-8 sm:py-12">
      <div className="enugu-container">
        <div className="mb-8 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-enugu-gold">Shop</p>
          <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-enugu-black sm:text-4xl">
            All Products
          </h1>
        </div>

        <div className="mb-6 lg:hidden">
          <ShopSearch value={filters.search} onChange={(v) => updateFilters({ search: v })} />
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((o) => !o)}
            className="enugu-btn-outline mt-3 w-full py-2.5 text-xs"
          >
            {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
          <aside className={`lg:block ${mobileFiltersOpen ? 'block' : 'hidden'}`}>
            <div className="sticky top-28 hidden lg:block">
              <ShopSearch value={filters.search} onChange={(v) => updateFilters({ search: v })} />
              <div className="mt-6">
                <ShopFilters
                  filters={filters}
                  categories={categories}
                  onChange={updateFilters}
                  onReset={resetFilters}
                />
              </div>
            </div>
            <div className="lg:hidden">
              <ShopFilters
                filters={filters}
                categories={categories}
                onChange={updateFilters}
                onReset={resetFilters}
              />
            </div>
          </aside>

          <div>
            <ShopSort value={filters.sort} onChange={(sort) => updateFilters({ sort })} count={products.length} />

            {error && (
              <div className="mt-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {loading ? (              <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200" />
                    <div className="mt-4 h-4 w-3/4 bg-gray-200" />
                    <div className="mt-2 h-3 w-1/2 bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="mt-10">
                {filters.search || filters.category || filters.size || filters.availability || filters.minPrice != null ? (
                  <>
                    <p className="text-center text-sm text-gray-500">No products match your filters.</p>
                    <div className="mt-4 text-center">
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="text-xs uppercase tracking-widest text-enugu-gold"
                      >
                        Clear filters
                      </button>
                    </div>
                  </>
                ) : (
                  <EmptyProductsState
                    message="Products published from the admin dashboard will appear here automatically."
                  />
                )}
              </div>
            ) : (              <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                {products.map((product) => (
                  <ShopProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ShopPage;
