import { useState, useEffect } from 'react';
import { COUPON_TYPES, COUPON_TYPE_OPTIONS } from '../../../constants/couponTypes';

const toFormValues = (coupon) => ({
  code: coupon?.code ?? '',
  type: coupon?.type ?? COUPON_TYPES.PERCENTAGE,
  value: coupon?.value ?? '',
  minOrderValue: coupon?.minOrderValue ?? 0,
  usageLimit: coupon?.usageLimit ?? '',
  maxDiscount: coupon?.maxDiscount ?? '',
  perUserLimit: coupon?.perUserLimit ?? 1,
  validFrom: coupon?.validFrom
    ? new Date(coupon.validFrom).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10),
  validUntil: coupon?.validUntil
    ? new Date(coupon.validUntil).toISOString().slice(0, 10)
    : '',
  isActive: coupon?.isActive ?? true,
});

const CouponForm = ({ initialData, onSubmit, onCancel, isEditing = false, loading = false }) => {
  const [form, setForm] = useState(toFormValues(initialData));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(toFormValues(initialData));
  }, [initialData]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next = {};

    if (!isEditing && !form.code.trim()) next.code = 'Coupon code is required';
    if (!form.validUntil) next.validUntil = 'Expiry date is required';

    if (form.type === COUPON_TYPES.PERCENTAGE) {
      if (!form.value || Number(form.value) <= 0) next.value = 'Percentage is required';
      else if (Number(form.value) > 100) next.value = 'Cannot exceed 100%';
    }

    if (form.type === COUPON_TYPES.FIXED && (!form.value || Number(form.value) <= 0)) {
      next.value = 'Discount amount is required';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      type: form.type,
      minOrderValue: Number(form.minOrderValue) || 0,
      perUserLimit: Number(form.perUserLimit) || 1,
      validFrom: form.validFrom,
      validUntil: form.validUntil,
      isActive: form.isActive,
    };

    if (!isEditing) payload.code = form.code.trim().toUpperCase();
    if (form.type !== COUPON_TYPES.FREE_SHIPPING) payload.value = Number(form.value);
    if (form.usageLimit) payload.usageLimit = Number(form.usageLimit);
    if (form.maxDiscount && form.type === COUPON_TYPES.PERCENTAGE) {
      payload.maxDiscount = Number(form.maxDiscount);
    }

    onSubmit(payload);
  };

  const inputClass = (field) =>
    `w-full rounded border px-3 py-2 text-sm outline-none focus:border-enugu-gold ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isEditing && (
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
            Coupon Code
          </label>
          <input
            type="text"
            value={form.code}
            onChange={(e) => update('code', e.target.value.toUpperCase())}
            placeholder="e.g. ENUGU10"
            className={`${inputClass('code')} uppercase`}
          />
          {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code}</p>}
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
          Coupon Type
        </label>
        <select
          value={form.type}
          onChange={(e) => update('type', e.target.value)}
          className={inputClass('type')}
        >
          {COUPON_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {form.type !== COUPON_TYPES.FREE_SHIPPING && (
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
            {form.type === COUPON_TYPES.PERCENTAGE ? 'Discount (%)' : 'Discount Amount (₹)'}
          </label>
          <input
            type="number"
            min="0"
            value={form.value}
            onChange={(e) => update('value', e.target.value)}
            className={inputClass('value')}
          />
          {errors.value && <p className="mt-1 text-xs text-red-500">{errors.value}</p>}
        </div>
      )}

      {form.type === COUPON_TYPES.PERCENTAGE && (
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
            Max Discount (₹, optional)
          </label>
          <input
            type="number"
            min="0"
            value={form.maxDiscount}
            onChange={(e) => update('maxDiscount', e.target.value)}
            className={inputClass('maxDiscount')}
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
            Minimum Order Value (₹)
          </label>
          <input
            type="number"
            min="0"
            value={form.minOrderValue}
            onChange={(e) => update('minOrderValue', e.target.value)}
            className={inputClass('minOrderValue')}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
            Usage Limit
          </label>
          <input
            type="number"
            min="1"
            value={form.usageLimit}
            onChange={(e) => update('usageLimit', e.target.value)}
            placeholder="Unlimited"
            className={inputClass('usageLimit')}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
            Start Date
          </label>
          <input
            type="date"
            value={form.validFrom}
            onChange={(e) => update('validFrom', e.target.value)}
            className={inputClass('validFrom')}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
            Expiry Date
          </label>
          <input
            type="date"
            value={form.validUntil}
            onChange={(e) => update('validUntil', e.target.value)}
            className={inputClass('validUntil')}
          />
          {errors.validUntil && <p className="mt-1 text-xs text-red-500">{errors.validUntil}</p>}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => update('isActive', e.target.checked)}
          className="accent-enugu-gold"
        />
        Active coupon
      </label>

      <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-enugu-black px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-enugu-gold hover:text-enugu-black disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Coupon' : 'Create Coupon'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-gray-300 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-gray-600 transition hover:border-enugu-black hover:text-enugu-black"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CouponForm;
