import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/helpers';

const BestSellingProducts = ({ products = [] }) => {
  if (!products.length) {
    return <p className="py-8 text-center text-sm text-gray-400">No sales data yet</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
            <th className="pb-3 pr-4 font-medium">Product</th>
            <th className="pb-3 pr-4 font-medium">SKU</th>
            <th className="pb-3 pr-4 font-medium">Sold</th>
            <th className="pb-3 font-medium">Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id ?? product.slug} className="border-b border-gray-50">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-enugu-gold/15 text-xs font-semibold text-enugu-gold">
                    {index + 1}
                  </span>
                  {product.image && (
                    <img
                      src={product.image}
                      alt=""
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                  <Link
                    to={`/product/${product.slug}`}
                    className="font-medium text-enugu-black hover:text-enugu-gold"
                  >
                    {product.name}
                  </Link>
                </div>
              </td>
              <td className="py-3 pr-4 text-gray-500">{product.sku}</td>
              <td className="py-3 pr-4 font-semibold text-enugu-black">{product.totalSold}</td>
              <td className="py-3 text-gray-600">{formatCurrency(product.sellingPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BestSellingProducts;
