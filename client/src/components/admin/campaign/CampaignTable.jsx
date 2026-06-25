import { FESTIVAL_TYPE_LABELS } from '../../../constants/campaignPresets';

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const CampaignTable = ({ campaigns, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-enugu-gold border-t-transparent" />
      </div>
    );
  }

  if (!campaigns.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
        <p className="text-sm text-gray-500">No campaigns yet. Create your first festival sale.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Name', 'Type', 'Coupon', 'Dates', 'Status', 'Actions'].map((head) => (
              <th
                key={head}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {campaigns.map((campaign) => (
            <tr key={campaign._id ?? campaign.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <p className="font-medium text-enugu-black">{campaign.name}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{campaign.greetingMessage}</p>
              </td>
              <td className="px-4 py-3 text-gray-600">
                {FESTIVAL_TYPE_LABELS[campaign.festivalType] ?? campaign.festivalType}
              </td>
              <td className="px-4 py-3 font-mono text-xs font-semibold">{campaign.couponCode}</td>
              <td className="px-4 py-3 text-xs text-gray-600">
                {formatDate(campaign.startDate)} — {formatDate(campaign.endDate)}
              </td>
              <td className="px-4 py-3">
                {campaign.isLive ? (
                  <span className="rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                    Live
                  </span>
                ) : !campaign.isActive ? (
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    Inactive
                  </span>
                ) : new Date(campaign.endDate) < new Date() ? (
                  <span className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
                    Ended
                  </span>
                ) : new Date(campaign.startDate) > new Date() ? (
                  <span className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                    Scheduled
                  </span>
                ) : (
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    Inactive
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit(campaign)}
                    className="text-xs font-medium uppercase tracking-wider text-enugu-black hover:text-enugu-gold"
                  >
                    Edit
                  </button>
                  {campaign.isActive && (
                    <button
                      type="button"
                      onClick={() => onDelete(campaign)}
                      className="text-xs font-medium uppercase tracking-wider text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignTable;
