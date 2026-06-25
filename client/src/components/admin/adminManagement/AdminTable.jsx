import AdminStatusBadge, { PermissionTags } from './AdminStatusBadge';
import { formatPermissionList } from '../../../constants/permissions';

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const fullName = (admin) =>
  `${admin.firstName ?? ''} ${admin.lastName ?? ''}`.trim() || '—';

const createdByLabel = (admin) => {
  const creator = admin.createdBy;
  if (!creator) return '—';
  if (typeof creator === 'object') {
    return `${creator.firstName ?? ''} ${creator.lastName ?? ''}`.trim() || creator.email;
  }
  return '—';
};

const AdminTable = ({ admins, loading, onEdit, onToggleStatus }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-enugu-gold border-t-transparent" />
      </div>
    );
  }

  if (!admins.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
        <p className="text-sm text-gray-500">No admin accounts yet.</p>
        <p className="mt-1 text-xs text-gray-400">Create an admin and assign permissions below.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Admin', 'Email', 'Permissions', 'Status', 'Last login', 'Created by', 'Actions'].map(
              (head) => (
                <th
                  key={head}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {head}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {admins.map((admin) => {
            const id = admin.id ?? admin._id;
            const permissions = admin.permissions ?? [];

            return (
              <tr key={id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-enugu-black">{fullName(admin)}</p>
                  {admin.phone && <p className="text-xs text-gray-400">{admin.phone}</p>}
                </td>
                <td className="px-4 py-3 text-gray-600">{admin.email}</td>
                <td className="px-4 py-3" title={formatPermissionList(permissions)}>
                  <PermissionTags permissions={permissions} />
                </td>
                <td className="px-4 py-3">
                  <AdminStatusBadge isActive={admin.isActive !== false} />
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {formatDate(admin.lastLoginAt)}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{createdByLabel(admin)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(admin)}
                      className="text-xs font-medium uppercase tracking-wider text-enugu-black hover:text-enugu-gold"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleStatus(admin)}
                      className={`text-xs font-medium uppercase tracking-wider ${
                        admin.isActive !== false
                          ? 'text-red-600 hover:text-red-800'
                          : 'text-green-700 hover:text-green-900'
                      }`}
                    >
                      {admin.isActive !== false ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
