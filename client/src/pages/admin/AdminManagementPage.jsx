import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../services/adminApi';
import { AdminTable, AdminForm } from '../../components/admin/adminManagement';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All admins' },
  { value: 'true', label: 'Active only' },
  { value: 'false', label: 'Disabled only' },
];

const AdminManagementPage = () => {
  const [admins, setAdmins] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await adminApi.admins.list({
        page,
        limit: 20,
        isActive: activeFilter || undefined,
      });
      const list = Array.isArray(result) ? result : result?.data ?? [];
      setAdmins(list);
      setMeta(result?.meta ?? { page: 1, totalPages: 1, total: list.length });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  }, [page, activeFilter]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const flashSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleCreate = async (payload) => {
    setSaving(true);
    setError('');
    try {
      await adminApi.admins.create(payload);
      setShowForm(false);
      flashSuccess('Admin account created');
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (payload) => {
    if (!editingAdmin) return;
    const id = editingAdmin.id ?? editingAdmin._id;
    setSaving(true);
    setError('');
    try {
      await adminApi.admins.update(id, payload);
      setEditingAdmin(null);
      flashSuccess('Admin updated');
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update admin');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!statusTarget) return;
    const id = statusTarget.id ?? statusTarget._id;
    const nextActive = statusTarget.isActive === false;
    setSaving(true);
    setError('');
    try {
      await adminApi.admins.setStatus(id, { isActive: nextActive });
      setStatusTarget(null);
      flashSuccess(nextActive ? 'Admin enabled' : 'Admin disabled');
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update admin status');
    } finally {
      setSaving(false);
    }
  };

  const openCreate = () => {
    setEditingAdmin(null);
    setShowForm(true);
  };

  const openEdit = (admin) => {
    setShowForm(false);
    setEditingAdmin(admin);
  };

  const promptToggleStatus = (admin) => {
    setStatusTarget(admin);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-enugu-black">Admin Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create admin accounts and control their access permissions.
          </p>
        </div>
        {!showForm && !editingAdmin && (
          <button
            type="button"
            onClick={openCreate}
            className="rounded bg-enugu-black px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-enugu-gold hover:text-enugu-black"
          >
            + Create Admin
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {(showForm || editingAdmin) && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-enugu-black">
            {editingAdmin
              ? `Edit ${editingAdmin.firstName} ${editingAdmin.lastName ?? ''}`.trim()
              : 'New Admin Account'}
          </h2>
          <AdminForm
            initialData={editingAdmin}
            isEditing={Boolean(editingAdmin)}
            loading={saving}
            onSubmit={editingAdmin ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingAdmin(null);
            }}
          />
        </div>
      )}

      {!showForm && !editingAdmin && (
        <>
          <div className="mb-4">
            <select
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value);
                setPage(1);
              }}
              className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold"
            >
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <AdminTable
            admins={admins}
            loading={loading}
            onEdit={openEdit}
            onToggleStatus={promptToggleStatus}
          />

          {meta.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
              <p>
                Page {meta.page} of {meta.totalPages} ({meta.total} admins)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded border border-gray-300 px-3 py-1.5 text-xs uppercase tracking-wider disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= meta.totalPages || loading}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded border border-gray-300 px-3 py-1.5 text-xs uppercase tracking-wider disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {statusTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-enugu-black">
              {statusTarget.isActive !== false ? 'Disable Admin' : 'Enable Admin'}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {statusTarget.isActive !== false ? (
                <>
                  Disable <strong>{statusTarget.email}</strong>? They will be signed out and unable
                  to log in.
                </>
              ) : (
                <>
                  Re-enable <strong>{statusTarget.email}</strong>? They can log in again with their
                  existing password.
                </>
              )}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={saving}
                className={`rounded px-4 py-2 text-xs font-medium uppercase tracking-wider text-white disabled:opacity-50 ${
                  statusTarget.isActive !== false
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-enugu-black hover:bg-enugu-gold hover:text-enugu-black'
                }`}
              >
                {saving ? 'Updating...' : statusTarget.isActive !== false ? 'Disable' : 'Enable'}
              </button>
              <button
                type="button"
                onClick={() => setStatusTarget(null)}
                className="rounded border border-gray-300 px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagementPage;
