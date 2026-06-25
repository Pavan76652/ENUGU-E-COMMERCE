import { ORDER_STATUS_LABELS } from '../../../constants/orders';

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const actorName = (changedBy) => {
  if (!changedBy) return 'System';
  if (typeof changedBy === 'string') return 'Admin';
  return `${changedBy.firstName ?? ''} ${changedBy.lastName ?? ''}`.trim() || changedBy.email || 'Admin';
};

const OrderTimeline = ({ history = [] }) => {
  const entries = [...history].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  if (!entries.length) {
    return (
      <div className="rounded border border-dashed border-gray-300 py-8 text-center text-sm text-gray-400">
        No status history yet.
      </div>
    );
  }

  return (
    <ol className="space-y-4">
      {entries.map((entry, index) => (
        <li key={`${entry.status}-${entry.timestamp}-${index}`} className="flex gap-3">
          <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-enugu-gold" />
          <div className="flex-1 border-b border-gray-100 pb-4">
            <p className="text-sm font-medium text-enugu-black">
              {ORDER_STATUS_LABELS[entry.status] ?? entry.status}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              {formatDate(entry.timestamp)} · {actorName(entry.changedBy)}
            </p>
            {entry.note && <p className="mt-1 text-sm text-gray-600">{entry.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
};

export default OrderTimeline;
