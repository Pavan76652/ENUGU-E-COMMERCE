import { useState, useEffect } from 'react';

const OrderNotesForm = ({ adminNotes = '', loading, onSubmit }) => {
  const [notes, setNotes] = useState(adminNotes ?? '');

  useEffect(() => {
    setNotes(adminNotes ?? '');
  }, [adminNotes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ adminNotes: notes.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded border border-gray-200 p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Admin notes</p>
      <p className="mt-1 text-xs text-gray-400">Internal notes — not visible to customers.</p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        maxLength={1000}
        placeholder="Packaging instructions, customer follow-up, etc."
        className="mt-3 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-3 rounded border border-gray-300 px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-700 hover:border-enugu-gold disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save notes'}
      </button>
    </form>
  );
};

export default OrderNotesForm;
