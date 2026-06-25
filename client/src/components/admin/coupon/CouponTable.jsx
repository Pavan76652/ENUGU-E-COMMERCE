import { COUPON_TYPE_LABELS, COUPON_TYPES } from '../../../constants/couponTypes';
import { formatCurrency } from '../../../utils/helpers';

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatValue = (coupon) => {
  if (coupon.type === COUPON_TYPES.PERCENTAGE) return `${coupon.value}%`;
  if (coupon.type === COUPON_TYPES.FREE_SHIPPING) return 'Free Shipping';
  return formatCurrency(coupon.value);
};

const isExpired = (coupon) => new Date(coupon.validUntil) < new Date();

const CouponTable = ({ coupons, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-enugu-gold border-t-transparent" />
      </div>
    );
  }

  if (!coupons.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
        <p className="text-sm text-gray-500">No coupons yet. Create your first coupon.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Code', 'Type', 'Value', 'Min Order', 'Usage', 'Expiry', 'Status', 'Actions'].map(
              (head) => (
                <th
                  key={head}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {head}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {coupons.map((coupon) => {
            const expired = isExpired(coupon);
            const usageText = coupon.usageLimit
              ? `${coupon.usedCount ?? 0} / ${coupon.usageLimit}`
              : `${coupon.usedCount ?? 0} / ∞`;

            return (
              <tr key={coupon._id ?? coupon.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-semibold text-enugu-black">{coupon.code}</td>
                <td className="px-4 py-3 text-gray-600">
                  {COUPON_TYPE_LABELS[coupon.type] ?? coupon.type}
                </td>
                <td className="px-4 py-3">{formatValue(coupon)}</td>
                <td className="px-4 py-3">{formatCurrency(coupon.minOrderValue)}</td>
                <td className="px-4 py-3 text-gray-600">{usageText}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(coupon.validUntil)}</td>
                <td className="px-4 py-3">
                  {!coupon.isActive ? (
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                      Inactive
                    </span>
                  ) : expired ? (
                    <span className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
                      Expired
                    </span>
                  ) : (
                    <span className="rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onEdit(coupon)}
                      className="text-xs font-medium uppercase tracking-wider text-enugu-black hover:text-enugu-gold"
                    >
                      Edit
                    </button>
                    {coupon.isActive && (
                      <button
                        type="button"
                        onClick={() => onDelete(coupon)}
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

export default CouponTable;
