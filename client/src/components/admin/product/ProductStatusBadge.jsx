import { PRODUCT_STATUS_LABELS } from '../../../constants/products';

const statusStyles = {
  draft: 'bg-gray-100 text-gray-700',
  published: 'bg-green-50 text-green-700',
  sold_out: 'bg-red-50 text-red-700',
  archived: 'bg-yellow-50 text-yellow-800',
};

const ProductStatusBadge = ({ status }) => (
  <span
    className={`rounded px-2 py-1 text-xs font-medium uppercase tracking-wide ${
      statusStyles[status] ?? 'bg-gray-100 text-gray-600'
    }`}
  >
    {PRODUCT_STATUS_LABELS[status] ?? status}
  </span>
);

export default ProductStatusBadge;
