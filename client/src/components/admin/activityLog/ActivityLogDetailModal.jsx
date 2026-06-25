import {
  ACTION_LABELS,
  RESOURCE_LABELS,
  formatMetadataSummary,
} from '../../../constants/activityLogs';

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const actorLabel = (log) => {
  const actor = log?.actorId;
  if (actor?.firstName) {
    return `${actor.firstName} ${actor.lastName ?? ''}`.trim();
  }
  return log?.actorEmail ?? 'Unknown';
};

const ActivityLogDetailModal = ({ log, onClose }) => {
  if (!log) return null;

  const resourceId = log.resourceId?._id ?? log.resourceId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-enugu-black">Activity details</h3>
            <p className="mt-1 text-xs text-gray-500">{formatDate(log.createdAt)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-enugu-black"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <dl className="mt-6 space-y-4 text-sm">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">Actor</dt>
            <dd className="mt-1 font-medium text-enugu-black">{actorLabel(log)}</dd>
            <dd className="text-xs text-gray-500">
              {log.actorEmail} · {log.actorRole}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">Action</dt>
            <dd className="mt-1">{ACTION_LABELS[log.action] ?? log.action}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">Resource</dt>
            <dd className="mt-1">
              {RESOURCE_LABELS[log.resource] ?? log.resource}
              {resourceId && (
                <span className="mt-1 block font-mono text-xs text-gray-400">{String(resourceId)}</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">Summary</dt>
            <dd className="mt-1 text-gray-700">{formatMetadataSummary(log) || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">IP address</dt>
            <dd className="mt-1 font-mono text-xs">{log.ipAddress ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">Metadata</dt>
            <dd className="mt-2">
              <pre className="overflow-x-auto rounded border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
                {JSON.stringify(log.metadata ?? {}, null, 2)}
              </pre>
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded border border-gray-300 px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-600 hover:border-enugu-gold"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ActivityLogDetailModal;
