import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { contactApi } from '../../services/contactApi';

const SUBJECTS = [
  'General Enquiry',
  'Order Support',
  'Product Question',
  'Custom Design',
  'Returns & Exchanges',
  'Other',
];

const ContactForm = () => {
  const user = useSelector(selectUser);
  const [form, setForm] = useState({
    name: user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    subject: SUBJECTS[0],
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setSubmitError('');
  };

  const validate = () => {
    const next = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      next.name = 'Enter your name';
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email';
    }
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, '').slice(-10))) {
      next.phone = 'Enter a valid 10-digit mobile number';
    }
    if (!form.subject.trim()) {
      next.subject = 'Select a subject';
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      next.message = 'Message must be at least 10 characters';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSubmitError('');

    try {
      const phoneDigits = form.phone.replace(/\D/g, '').slice(-10);
      await contactApi.submit({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: phoneDigits || undefined,
        subject: form.subject,
        message: form.message.trim(),
      });
      setSuccess(true);
      setForm((prev) => ({
        ...prev,
        subject: SUBJECTS[0],
        message: '',
      }));
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (Array.isArray(apiErrors)) {
        const mapped = {};
        apiErrors.forEach((item) => {
          if (item.field) mapped[item.field] = item.message;
        });
        setErrors(mapped);
      }
      setSubmitError(err.response?.data?.message || 'Could not send your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded border border-enugu-gold/30 bg-enugu-gold/5 p-6 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-enugu-gold">Message Sent</p>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          Thank you for reaching out. Our team will get back to you within 24–48 hours.
          For urgent queries, use WhatsApp or call us directly.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 text-xs font-medium uppercase tracking-wider text-enugu-black underline-offset-2 hover:text-enugu-gold hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputClass =
    'w-full border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-enugu-gold';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
            Name *
          </label>
          <input
            id="contact-name"
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className={inputClass}
            placeholder="Your name"
            disabled={loading}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
            Email *
          </label>
          <input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className={inputClass}
            placeholder="you@email.com"
            disabled={loading}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
            Phone
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className={inputClass}
            placeholder="10-digit mobile"
            disabled={loading}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
            Subject *
          </label>
          <select
            id="contact-subject"
            value={form.subject}
            onChange={(e) => update('subject', e.target.value)}
            className={inputClass}
            disabled={loading}
          >
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
          Message *
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          className={`${inputClass} resize-y`}
          placeholder="How can we help you?"
          disabled={loading}
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
      </div>

      {submitError && (
        <p className="text-sm text-red-600">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="enugu-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {loading ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
};

export default ContactForm;
