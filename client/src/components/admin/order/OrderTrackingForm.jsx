import { useState, useEffect } from 'react';

const OrderTrackingForm = ({ trackingNumber = '', carrier = '', loading, onSubmit }) => {
  const [form, setForm] = useState({ trackingNumber, carrier });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({ trackingNumber: trackingNumber ?? '', carrier: carrier ?? '' });
  }, [trackingNumber, carrier]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.trackingNumber.trim()) next.trackingNumber = 'Tracking number is required';
    if (!form.carrier.trim()) next.carrier = 'Carrier is required';
    setErrors(next);
    if (Object.keys(next).length) return;

    onSubmit({
      trackingNumber: form.trackingNumber.trim(),
      carrier: form.carrier.trim(),
    });
  };

  const inputClass = (field) =>
    `w-full rounded border px-3 py-2 text-sm outline-none focus:border-enugu-gold ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="rounded border border-gray-200 p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Shipping tracking</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Carrier</label>
          <input
            type="text"
            value={form.carrier}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, carrier: e.target.value }));
              setErrors((prev) => ({ ...prev, carrier: '' }));
            }}
            placeholder="e.g. Delhivery, BlueDart"
            className={inputClass('carrier')}
          />
          {errors.carrier && <p className="mt-1 text-xs text-red-600">{errors.carrier}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Tracking number</label>
          <input
            type="text"
            value={form.trackingNumber}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, trackingNumber: e.target.value }));
              setErrors((prev) => ({ ...prev, trackingNumber: '' }));
            }}
            placeholder="AWB / tracking ID"
            className={inputClass('trackingNumber')}
          />
          {errors.trackingNumber && (
            <p className="mt-1 text-xs text-red-600">{errors.trackingNumber}</p>
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded border border-gray-300 px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-700 hover:border-enugu-gold disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save tracking'}
      </button>
    </form>
  );
};

export default OrderTrackingForm;
