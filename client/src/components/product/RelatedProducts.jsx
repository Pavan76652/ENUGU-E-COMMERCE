import ShopProductCard from '../shop/ShopProductCard';

const RelatedProducts = ({ products = [] }) => {
  if (!products.length) return null;

  return (
    <div className="mt-16 border-t border-gray-100 pt-10">
      <h2 className="font-display text-xl font-bold uppercase tracking-wide text-enugu-black sm:text-2xl">
        You May Also Like
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <ShopProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
