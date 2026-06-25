import { useState } from 'react';
import { INDIAN_STATES } from '../../constants/checkout';

const emptyAddress = {
  label: 'Home',
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  isDefault: false,
};

const AddressForm = ({ initialValues = {}, onSubmit, onCancel, submitLabel = 'Save Address' }) => {
  const [form, setForm] = useState({ ...emptyAddress, ...initialValues });
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next = {};

    if (!form.fullName.trim()) next.fullName = 'Full name is required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) next.phone = 'Enter a valid 10-digit mobile number';
    if (!form.addressLine1.trim()) next.addressLine1 = 'Address is required';
    if (!form.city.trim()) next.city = 'City is required';
    if (!form.state) next.state = 'State is required';
    if (!/^\d{6}$/.test(form.pincode)) next.pincode = 'Enter a valid 6-digit pincode';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const inputClass = (field) =>
    `w-full border px-3 py-2.5 text-sm outline-none transition focus:border-enugu-gold ${
      errors[field] ? 'border-red-400' : 'border-gray-200'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">Label</label>
          <input
            type="text"
            value={form.label}
            onChange={(e) => update('label', e.target.value)}
            placeholder="Home, Office..."
            className={inputClass('label')}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">Full Name</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            className={inputClass('fullName')}
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">Phone</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder="10-digit mobile number"
          className={inputClass('phone')}
        />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">Address Line 1</label>
        <input
          type="text"
          value={form.addressLine1}
          onChange={(e) => update('addressLine1', e.target.value)}
          className={inputClass('addressLine1')}
        />
        {errors.addressLine1 && <p className="mt-1 text-xs text-red-500">{errors.addressLine1}</p>}
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">Address Line 2 (Optional)</label>
        <input
          type="text"
          value={form.addressLine2}
          onChange={(e) => update('addressLine2', e.target.value)}
          className={inputClass('addressLine2')}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">City</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
            className={inputClass('city')}
          />
          {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">State</label>
          <select
            value={form.state}
            onChange={(e) => update('state', e.target.value)}
            className={inputClass('state')}
          >
            <option value="">Select state</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">Pincode</label>
          <input
            type="text"
            value={form.pincode}
            onChange={(e) => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
            className={inputClass('pincode')}
          />
          {errors.pincode && <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => update('isDefault', e.target.checked)}
          className="accent-enugu-gold"
        />
        Set as default address
      </label>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          className="bg-enugu-black px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-enugu-white transition hover:bg-enugu-gold hover:text-enugu-black"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border border-gray-300 px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-gray-600 transition hover:border-enugu-black hover:text-enugu-black"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddressForm;
