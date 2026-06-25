import { PERMISSION_LABELS } from '../../../constants/permissions';

const AdminStatusBadge = ({ isActive }) => (
  <span
    className={`rounded px-2 py-1 text-xs font-medium uppercase tracking-wide ${
      isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
    }`}
  >
    {isActive ? 'Active' : 'Disabled'}
  </span>
);

export const PermissionTags = ({ permissions = [], max = 3 }) => {
  if (!permissions.length) {
    return <span className="text-xs text-gray-400">None assigned</span>;
  }

  const shown = permissions.slice(0, max);
  const remaining = permissions.length - shown.length;

  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((perm) => (
        <span
          key={perm}
          className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600"
          title={PERMISSION_LABELS[perm] ?? perm}
        >
          {perm.split('.')[0]}
        </span>
      ))}
      {remaining > 0 && (
        <span className="rounded bg-enugu-gold/20 px-1.5 py-0.5 text-[10px] font-medium text-enugu-black">
          +{remaining}
        </span>
      )}
    </div>
  );
};

export default AdminStatusBadge;
