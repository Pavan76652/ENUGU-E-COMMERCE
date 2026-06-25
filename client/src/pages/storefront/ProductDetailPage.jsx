import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { catalogService } from '../../services/catalogService';
import ImageGallery from '../../components/product/ImageGallery';
import ProductInfo from '../../components/product/ProductInfo';
import { Seo } from '../../components/seo';
import { buildProductSeo } from '../../utils/seo';
import { ROUTES } from '../../config/routes';
const ProductDetailPage = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    catalogService
      .getProductBySlug(slug)
      .then((result) => {
        if (!result?.product) {
          setNotFound(true);
        } else {
          setData(result);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);
  if (loading) {
    return (
      <div className="enugu-container py-12">
        <div className="grid animate-pulse gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="aspect-[3/4] bg-gray-200 lg:col-span-7" />
          <div className="space-y-4 lg:col-span-5">
            <div className="h-8 w-3/4 bg-gray-200" />
            <div className="h-6 w-1/3 bg-gray-200" />
            <div className="h-32 bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="enugu-container flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
        <h1 className="font-display text-2xl font-bold uppercase">Product Not Found</h1>
        <Link to={ROUTES.SHOP} className="enugu-btn-primary mt-6">
          Back to Shop
        </Link>
      </div>
    );
  }

  const { product, related, reviews, seo } = data;
  const productSeo = buildProductSeo(product, seo);

  return (
    <>
      <Seo {...productSeo} image={productSeo.openGraph?.image || product.image} />

      <div className="py-8 sm:py-12">
        <div className="enugu-container">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <ImageGallery images={product.images} productName={product.name} />
            <ProductInfo product={product} reviews={reviews} related={related} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
