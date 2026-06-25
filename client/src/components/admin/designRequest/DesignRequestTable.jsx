import {
  DESIGN_REQUEST_STATUS_LABELS,
  DESIGN_REQUEST_STATUS_OPTIONS,
} from '../../../constants/designRequest';

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

const statusClass = (status) => {
  const map = {
    new: 'bg-blue-50 text-blue-700',
    contacted: 'bg-yellow-50 text-yellow-800',
    quotation_sent: 'bg-purple-50 text-purple-700',
    confirmed: 'bg-green-50 text-green-700',
    completed: 'bg-gray-100 text-gray-700',
  };
  return map[status] ?? 'bg-gray-100 text-gray-600';
};

const DesignRequestTable = ({ requests, onSelect, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-enugu-gold border-t-transparent" />
      </div>
    );
  }

  if (!requests.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
        <p className="text-sm text-gray-500">No custom design requests yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Customer', 'Contact', 'Quantity', 'Status', 'Submitted', ''].map((head) => (
              <th
                key={head || 'action'}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {requests.map((request) => (
            <tr key={request._id ?? request.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <p className="font-medium text-enugu-black">{request.customerName}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{request.designBrief}</p>
              </td>
              <td className="px-4 py-3 text-xs text-gray-600">
                <p>{request.email}</p>
                <p className="mt-0.5">{request.phone}</p>
              </td>
              <td className="px-4 py-3">{request.quantity}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${statusClass(request.status)}`}
                >
                  {DESIGN_REQUEST_STATUS_LABELS[request.status] ?? request.status}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-gray-500">{formatDate(request.createdAt)}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onSelect(request)}
                  className="text-xs font-medium uppercase tracking-wider text-enugu-black hover:text-enugu-gold"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DesignRequestTable;
