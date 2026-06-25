import { useState, useEffect, useCallback } from 'react';
import { designRequestApi } from '../../services/designRequestApi';
import { DESIGN_REQUEST_STATUS_OPTIONS } from '../../constants/designRequest';
import { DesignRequestTable, DesignRequestDetail } from '../../components/admin/designRequest';

const AdminDesignRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await designRequestApi.admin.list({
        status: statusFilter || undefined,
        search: search || undefined,
        limit: 50,
      });
      setRequests(Array.isArray(result) ? result : result?.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load design requests');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleUpdate = async (payload) => {
    if (!selected) return;
    setSaving(true);
    setError('');
    try {
      const result = await designRequestApi.admin.update(
        selected._id ?? selected.id,
        payload
      );
      const updated = result.request ?? result;
      setSelected(null);
      setRequests((prev) =>
        prev.map((r) => ((r._id ?? r.id) === (updated._id ?? updated.id) ? updated : r))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update request');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-enugu-black">Custom Design Requests</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage customer custom tee design enquiries.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, phone..."
          className="w-full max-w-sm rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold sm:w-48"
        >
          <option value="">All statuses</option>
          {DESIGN_REQUEST_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <DesignRequestTable
        requests={requests}
        loading={loading}
        onSelect={setSelected}
      />

      {selected && (
        <DesignRequestDetail
          request={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
          saving={saving}
        />
      )}
    </div>
  );
};

export default AdminDesignRequestsPage;
