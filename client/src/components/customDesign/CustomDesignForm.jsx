import { useState } from 'react';
import { designRequestApi } from '../../services/designRequestApi';
import ContactButtons from './ContactButtons';
import { CUSTOM_DESIGN } from '../../constants/homeData';

const CustomDesignForm = () => {
  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    designDescription: '',
    quantity: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setSubmitError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: 'Only JPEG, PNG, or WebP images allowed' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image must be under 5MB' }));
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.customerName.trim()) next.customerName = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Invalid email';
    if (!/^[6-9]\d{9}$/.test(form.phone)) next.phone = 'Enter a valid 10-digit mobile number';
    if (!form.designDescription.trim() || form.designDescription.trim().length < 10) {
      next.designDescription = 'Please describe your design (min 10 characters)';
    }
    if (!form.quantity || Number(form.quantity) < 1) next.quantity = 'Quantity is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSubmitError('');

    try {
      const formData = new FormData();
      formData.append('customerName', form.customerName.trim());
      formData.append('email', form.email.trim());
      formData.append('phone', form.phone);
      formData.append('designDescription', form.designDescription.trim());
      formData.append('quantity', form.quantity);
      if (image) formData.append('referenceImage', image);

      await designRequestApi.submit(formData);
      setSuccess(true);
      setForm({ customerName: '', email: '', phone: '', designDescription: '', quantity: '' });
      setImage(null);
      setPreview('');
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.message ||
          'Failed to submit request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full border px-3 py-2.5 text-sm outline-none transition focus:border-enugu-gold ${
      errors[field] ? 'border-red-400' : 'border-gray-200'
    }`;

  if (success) {
    return (
      <div className="border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
          ✓
        </div>
        <h3 className="font-display text-xl font-bold uppercase tracking-wide text-enugu-black">
          Request Submitted
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          We&apos;ve received your custom design request. Our team will contact you shortly.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 text-xs uppercase tracking-wider text-enugu-gold hover:underline"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">Name</label>
          <input
            type="text"
            value={form.customerName}
            onChange={(e) => update('customerName', e.target.value)}
            className={inputClass('customerName')}
          />
          {errors.customerName && <p className="mt-1 text-xs text-red-500">{errors.customerName}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">Phone Number</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="10-digit mobile"
            className={inputClass('phone')}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          className={inputClass('email')}
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">Design Description</label>
        <textarea
          rows={5}
          value={form.designDescription}
          onChange={(e) => update('designDescription', e.target.value)}
          placeholder="Describe your design idea, colors, placement, style references..."
          className={inputClass('designDescription')}
        />
        {errors.designDescription && (
          <p className="mt-1 text-xs text-red-500">{errors.designDescription}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">Quantity</label>
        <input
          type="number"
          min="1"
          value={form.quantity}
          onChange={(e) => update('quantity', e.target.value)}
          className={`${inputClass('quantity')} max-w-xs`}
        />
        {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity}</p>}
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">
          Reference Image (optional)
        </label>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleImageChange}
          className="w-full text-sm text-gray-600 file:mr-4 file:border-0 file:bg-enugu-black file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-wider file:text-white"
        />
        {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
        {preview && (
          <img src={preview} alt="Reference preview" className="mt-3 h-40 w-40 object-cover" />
        )}
      </div>

      {submitError && (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-enugu-black py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-enugu-white transition hover:bg-enugu-gold hover:text-enugu-black disabled:opacity-50 sm:w-auto sm:px-10"
      >
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>

      <div className="border-t border-gray-200 pt-6">
        <p className="mb-4 text-center text-xs uppercase tracking-wider text-gray-500">
          Prefer to talk directly?
        </p>
        <ContactButtons
          message={`Hi ENUGU, I'd like to discuss a custom design. ${CUSTOM_DESIGN.title}`}
        />
      </div>
    </form>
  );
};

export default CustomDesignForm;
