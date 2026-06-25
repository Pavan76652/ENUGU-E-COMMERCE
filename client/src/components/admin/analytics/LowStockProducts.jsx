import { Link } from 'react-router-dom';

const LowStockProducts = ({ products = [] }) => {
  if (!products.length) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        All products are well stocked
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[400px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
            <th className="pb-3 pr-4 font-medium">Product</th>
            <th className="pb-3 pr-4 font-medium">Size</th>
            <th className="pb-3 font-medium">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr
              key={`${item.slug}-${item.size}`}
              className="border-b border-gray-50"
            >
              <td className="py-3 pr-4">
                <Link
                  to={`/product/${item.slug}`}
                  className="font-medium text-enugu-black hover:text-enugu-gold"
                >
                  {item.product ?? item.name}
                </Link>
              </td>
              <td className="py-3 pr-4 text-gray-600">{item.size}</td>
              <td className="py-3">
                <span
                  className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${
                    item.stock === 0
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.stock === 0 ? 'Out of stock' : `${item.stock} left`}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LowStockProducts;
