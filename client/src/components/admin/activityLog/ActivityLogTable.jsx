import { Link } from 'react-router-dom';
import { ROUTES } from '../../../config/routes';
import {
  ACTION_LABELS,
  RESOURCE_LABELS,
  getActionBadgeClass,
  formatMetadataSummary,
  AUDIT_RESOURCES,
} from '../../../constants/activityLogs';

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

const actorLabel = (log) => {
  const actor = log.actorId;
  if (actor?.firstName) {
    return `${actor.firstName} ${actor.lastName ?? ''}`.trim();
  }
  return log.actorEmail ?? 'Unknown';
};

const getResourceLink = (log) => {
  const id = log.resourceId?._id ?? log.resourceId;
  const m = log.metadata ?? {};

  if (log.resource === AUDIT_RESOURCES.ORDER && m.orderNumber) {
    return ROUTES.ADMIN_ORDER.replace(':orderNumber', m.orderNumber);
  }
  if (log.resource === AUDIT_RESOURCES.PRODUCT && id) {
    return ROUTES.ADMIN_PRODUCT_EDIT.replace(':id', id);
  }
  if (log.resource === AUDIT_RESOURCES.CUSTOMER && id) {
    return ROUTES.ADMIN_CUSTOMER.replace(':id', id);
  }
  return null;
};

const ActivityLogTable = ({ logs, loading, onViewDetails }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-enugu-gold border-t-transparent" />
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
        <p className="text-sm text-gray-500">No activity logs found.</p>
        <p className="mt-1 text-xs text-gray-400">
          Admin actions such as product updates and order changes appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['When', 'Actor', 'Action', 'Resource', 'Details', 'IP', ''].map((head) => (
              <th
                key={head || 'actions'}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {logs.map((log) => {
            const id = log._id ?? log.id;
            const summary = formatMetadataSummary(log);
            const resourceLink = getResourceLink(log);
            const resourceId = log.resourceId?._id ?? log.resourceId;

            return (
              <tr key={id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                  {formatDate(log.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-enugu-black">{actorLabel(log)}</p>
                  <p className="text-xs capitalize text-gray-400">{log.actorRole}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded px-2 py-1 text-xs font-medium ${getActionBadgeClass(log.action)}`}
                  >
                    {ACTION_LABELS[log.action] ?? log.action}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-gray-700">{RESOURCE_LABELS[log.resource] ?? log.resource}</p>
                  {resourceLink ? (
                    <Link
                      to={resourceLink}
                      className="text-xs font-medium text-enugu-gold hover:underline"
                    >
                      Open
                    </Link>
                  ) : resourceId ? (
                    <p className="font-mono text-[10px] text-gray-400">{String(resourceId).slice(-8)}</p>
                  ) : null}
                </td>
                <td className="max-w-xs px-4 py-3 text-gray-600">
                  <p className="truncate text-xs">{summary || '—'}</p>
                </td>
                <td className="px-4 py-3 font-mono text-[10px] text-gray-400">
                  {log.ipAddress ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onViewDetails(log)}
                    className="text-xs font-medium uppercase tracking-wider text-enugu-black hover:text-enugu-gold"
                  >
                    Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityLogTable;
