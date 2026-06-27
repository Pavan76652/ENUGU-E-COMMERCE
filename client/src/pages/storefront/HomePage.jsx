import { useState, useEffect } from 'react';
import {
  HeroBanner,
  ProductGrid,
  FeaturedProducts,
  CustomDesignBanner,
  CustomerReviews,
  InstagramGallery,
  Newsletter,
} from '../../components/home';
import { Seo } from '../../components/seo';
import { PAGE_SEO } from '../../utils/seo';
import { ROUTES } from '../../config/routes';
import { catalogService } from '../../services/catalogService';
import EmptyProductsState from '../../components/common/EmptyProductsState';

const HomePage = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loadingNew, setLoadingNew] = useState(true);
  const [loadingBest, setLoadingBest] = useState(true);

  useEffect(() => {
    catalogService
      .getProducts({ isNewArrival: 'true', limit: 4, sort: 'newest' })
      .then((result) => setNewArrivals(result.products))
      .catch(() => setNewArrivals([]))
      .finally(() => setLoadingNew(false));

    catalogService
      .getProducts({ sort: 'best-selling', limit: 4 })
      .then((result) => setBestSellers(result.products))
      .catch(() => setBestSellers([]))
      .finally(() => setLoadingBest(false));
  }, []);

  // Derive "empty catalog" from the two product calls instead of a third request.
  const catalogEmpty = !loadingNew && !loadingBest
    && newArrivals.length === 0 && bestSellers.length === 0;

  return (
    <>
      <Seo {...PAGE_SEO.home} />
      <HeroBanner />

      {catalogEmpty ? (
        <section className="py-14 sm:py-20">
          <div className="enugu-container">
            <EmptyProductsState
              message="Our latest drops will appear here once published from the admin dashboard."
            />
          </div>
        </section>
      ) : (
        <>
          <ProductGrid
            eyebrow="Just Dropped"
            title="New Arrivals"
            subtitle="Fresh prints. Limited quantities. Once they're gone, they're gone."
            products={newArrivals}
            loading={loadingNew}
            viewAllLink={`${ROUTES.SHOP}?sort=newest`}
            hideWhenEmpty
            emptyMessage="No new arrivals at the moment. Explore the full shop."
          />

          <ProductGrid
            eyebrow="Fan Favorites"
            title="Best Sellers"
            subtitle="The pieces our community keeps coming back for."
            products={bestSellers}
            loading={loadingBest}
            viewAllLink={`${ROUTES.SHOP}?sort=best-selling`}
            hideWhenEmpty
            emptyMessage="Best sellers will appear as orders come in."
          />
        </>
      )}

      <FeaturedProducts />
      <CustomDesignBanner />
      <CustomerReviews />
      <InstagramGallery />
      <Newsletter />
    </>
  );
};

export default HomePage;
