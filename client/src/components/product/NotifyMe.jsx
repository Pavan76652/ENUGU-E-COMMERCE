import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { stockNotificationApi } from '../../services/stockNotificationApi';

const NotifyMe = ({ productId, productName, size = null, compact = false }) => {
  const user = useSelector(selectUser);
  const [email, setEmail] = useState(user?.email ?? '');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      const result = await stockNotificationApi.subscribe({
        productId,
        email: email.trim(),
        size: size || null,
      });

      setStatus('success');
      setMessage(
        result?.message ??
          "You're on the list. We'll email you when this item is back in stock."
      );
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message ?? 'Could not save your notification. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`rounded border border-enugu-gold/30 bg-enugu-gold/5 ${compact ? 'p-4' : 'p-5'}`}>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-enugu-gold">Subscribed</p>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
      </div>
    );
  }

  return (
    <div className={`rounded border border-gray-200 bg-gray-50 ${compact ? 'p-4' : 'p-5'}`}>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-enugu-black">Notify Me</p>
      <p className="mt-2 text-sm text-gray-600">
        {size
          ? `Get an email when size ${size} of ${productName} is back in stock.`
          : `${productName} is sold out. Enter your email and we'll notify you when it's available again.`}
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          disabled={status === 'loading'}
          className="flex-1 border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-enugu-gold disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="enugu-btn-primary shrink-0 px-6 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? 'Saving…' : 'Notify Me'}
        </button>
      </form>

      {status === 'error' && message && (
        <p className="mt-3 text-sm text-red-600">{message}</p>
      )}
    </div>
  );
};

export default NotifyMe;
