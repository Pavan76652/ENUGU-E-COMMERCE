import { useState } from 'react';
import {
  ORDER_STATUS_LABELS,
  getNextOrderStatuses,
} from '../../../constants/orders';
import { OrderStatusBadge } from './OrderStatusBadge';

const OrderStatusUpdater = ({ currentStatus, loading, onUpdate }) => {
  const [note, setNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const nextStatuses = getNextOrderStatuses(currentStatus);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStatus) return;
    onUpdate({ status: selectedStatus, note: note.trim() || undefined });
    setNote('');
    setSelectedStatus('');
  };

  if (!nextStatuses.length) {
    return (
      <div className="rounded border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Order status</p>
        <div className="mt-2">
          <OrderStatusBadge status={currentStatus} />
        </div>
        <p className="mt-2 text-xs text-gray-400">No further status transitions available.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded border border-gray-200 p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Update status</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-sm text-gray-500">Current:</span>
        <OrderStatusBadge status={currentStatus} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {nextStatuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setSelectedStatus(status)}
            className={`rounded border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
              selectedStatus === status
                ? 'border-enugu-gold bg-enugu-gold text-enugu-black'
                : 'border-gray-300 text-gray-600 hover:border-enugu-black'
            }`}
          >
            {ORDER_STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {selectedStatus && (
        <>
          <div className="mt-4">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="Reason or internal note for this status change..."
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-3 rounded bg-enugu-black px-4 py-2 text-xs font-medium uppercase tracking-wider text-white hover:bg-enugu-gold hover:text-enugu-black disabled:opacity-50"
          >
            {loading ? 'Updating...' : `Mark as ${ORDER_STATUS_LABELS[selectedStatus]}`}
          </button>
        </>
      )}
    </form>
  );
};

export default OrderStatusUpdater;
