import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../services/adminApi';
import { ActivityLogTable, ActivityLogDetailModal } from '../../components/admin/activityLog';
import { ACTION_FILTER_OPTIONS, RESOURCE_FILTER_OPTIONS } from '../../constants/activityLogs';

const AdminActivityLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const [detailLog, setDetailLog] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await adminApi.getActivityLogs({
        page,
        limit: 25,
        search: search.trim() || undefined,
        action: actionFilter || undefined,
        resource: resourceFilter || undefined,
        from: fromDate || undefined,
        to: toDate ? `${toDate}T23:59:59.999Z` : undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      const list = Array.isArray(result) ? result : result?.data ?? [];
      setLogs(list);
      setMeta(result?.meta ?? { page: 1, totalPages: 1, total: list.length });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  }, [page, search, actionFilter, resourceFilter, fromDate, toDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const clearFilters = () => {
    setSearch('');
    setActionFilter('');
    setResourceFilter('');
    setFromDate('');
    setToDate('');
    setPage(1);
  };

  const hasFilters = search || actionFilter || resourceFilter || fromDate || toDate;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-enugu-black">Activity Logs</h1>
        <p className="mt-1 text-sm text-gray-500">
          Audit trail of admin actions across products, orders, coupons, and more.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-4 space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search actor email or action..."
            className="w-full flex-1 rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold sm:max-w-md"
          />
          <button
            type="submit"
            className="rounded border border-gray-300 px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-600 hover:border-enugu-gold"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold"
          >
            {ACTION_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value || 'all-actions'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={resourceFilter}
            onChange={(e) => {
              setResourceFilter(e.target.value);
              setPage(1);
            }}
            className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold"
          >
            {RESOURCE_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value || 'all-resources'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPage(1);
            }}
            className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold"
            title="From date"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPage(1);
            }}
            className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold"
            title="To date"
          />
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded border border-gray-300 px-3 py-2 text-xs font-medium uppercase tracking-wider text-gray-500 hover:border-enugu-gold"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <ActivityLogTable logs={logs} loading={loading} onViewDetails={setDetailLog} />

      {meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
          <p>
            Page {meta.page} of {meta.totalPages} ({meta.total} entries)
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

      <ActivityLogDetailModal log={detailLog} onClose={() => setDetailLog(null)} />
    </div>
  );
};

export default AdminActivityLogsPage;
