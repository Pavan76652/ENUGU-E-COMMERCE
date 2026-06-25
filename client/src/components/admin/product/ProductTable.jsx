import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/helpers';
import { ROUTES } from '../../../config/routes';
import ProductStatusBadge from './ProductStatusBadge';

const getCover = (product) => {
  const cover = product.images?.find((img) => img.isCover) ?? product.images?.[0];
  return cover?.url ?? product.image ?? null;
};

const totalStock = (product) =>
  product.inventory?.totalStock ??
  product.sizeStock?.reduce((sum, s) => sum + (s.stock ?? 0), 0) ??
  0;

const ProductTable = ({ products, onStatusChange, onArchive, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-enugu-gold border-t-transparent" />
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
        <p className="text-sm text-gray-500">No products found. Create your first product.</p>
        <Link
          to={ROUTES.ADMIN_PRODUCT_CREATE}
          className="mt-4 inline-block text-xs font-medium uppercase tracking-wider text-enugu-gold hover:underline"
        >
          + Add Product
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((head) => (
              <th
                key={head}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => {
            const id = product._id ?? product.id;
            const cover = getCover(product);

            return (
              <tr key={id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {cover ? (
                      <img src={cover} alt="" className="h-12 w-10 rounded object-cover" />
                    ) : (
                      <div className="flex h-12 w-10 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                        —
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-enugu-black">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">{product.sku}</td>
                <td className="px-4 py-3 text-gray-600">
                  {product.categoryId?.name ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{formatCurrency(product.sellingPrice)}</p>
                  <p className="text-xs text-gray-400 line-through">{formatCurrency(product.mrp)}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">{totalStock(product)}</td>
                <td className="px-4 py-3">
                  <ProductStatusBadge status={product.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={ROUTES.ADMIN_PRODUCT_EDIT.replace(':id', id)}
                      className="text-xs font-medium uppercase tracking-wider text-enugu-black hover:text-enugu-gold"
                    >
                      Edit
                    </Link>
                    {product.status === 'draft' && (
                      <button
                        type="button"
                        onClick={() => onStatusChange(product, 'published')}
                        className="text-xs font-medium uppercase tracking-wider text-green-700 hover:text-green-900"
                      >
                        Publish
                      </button>
                    )}
                    {product.status === 'published' && (
                      <button
                        type="button"
                        onClick={() => onStatusChange(product, 'draft')}
                        className="text-xs font-medium uppercase tracking-wider text-gray-600 hover:text-enugu-black"
                      >
                        Unpublish
                      </button>
                    )}
                    {product.status !== 'archived' && (
                      <button
                        type="button"
                        onClick={() => onArchive(product)}
                        className="text-xs font-medium uppercase tracking-wider text-amber-700 hover:text-amber-900"
                      >
                        Archive
                      </button>
                    )}
                    {product.status === 'draft' && (
                      <button
                        type="button"
                        onClick={() => onDelete(product)}
                        className="text-xs font-medium uppercase tracking-wider text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
