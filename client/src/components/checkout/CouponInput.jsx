import { useState } from 'react';
import { formatCurrency } from '../../utils/helpers';
import { getCouponSavingsLabel } from '../../utils/orderPricing';
import { COUPON_TYPES } from '../../constants/couponTypes';

const CouponInput = ({ subtotal, appliedCoupon, onApply, onRemove }) => {
  const [code, setCode] = useState(appliedCoupon?.code ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');

    try {
      await onApply(code.trim());
    } catch (err) {
      setError(err.message || 'Invalid coupon code');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode('');
    setError('');
    onRemove();
  };

  const savingsText = appliedCoupon
    ? appliedCoupon.type === COUPON_TYPES.FREE_SHIPPING
      ? 'Free shipping applied'
      : `You save ${formatCurrency(appliedCoupon.totalSavings ?? appliedCoupon.discount ?? 0)}`
    : '';

  return (
    <div className="border-t border-gray-200 pt-4">
      <p className="text-xs uppercase tracking-wider text-gray-500">Coupon Code</p>

      {appliedCoupon ? (
        <div className="mt-3 flex items-center justify-between rounded border border-green-200 bg-green-50 px-3 py-2.5">
          <div>
            <p className="text-sm font-medium text-green-800">{appliedCoupon.code}</p>
            <p className="text-xs text-green-700">{savingsText || getCouponSavingsLabel(appliedCoupon)}</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs uppercase tracking-wider text-green-800 hover:underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="mt-3 flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="min-w-0 flex-1 border border-gray-200 px-3 py-2.5 text-sm uppercase outline-none focus:border-enugu-gold"
          />
          <button
            type="submit"
            disabled={loading || !code.trim() || subtotal <= 0}
            className="shrink-0 bg-enugu-black px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-enugu-white transition hover:bg-enugu-gold hover:text-enugu-black disabled:opacity-50"
          >
            {loading ? '...' : 'Apply'}
          </button>
        </form>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default CouponInput;
