import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../services/adminApi';
import { CustomerTable } from '../../components/admin/customer';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All customers' },
  { value: 'true', label: 'Active only' },
  { value: 'false', label: 'Disabled only' },
];

const VERIFIED_FILTER_OPTIONS = [
  { value: '', label: 'All verification' },
  { value: 'true', label: 'Email verified' },
  { value: 'false', label: 'Not verified' },
];
const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [page, setPage] = useState(1);
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await adminApi.getCustomers({
        page,
        limit: 20,
        search: search.trim() || undefined,
        isActive: activeFilter || undefined,
        isEmailVerified: verifiedFilter || undefined,
        sortBy: 'createdAt',        sortOrder: 'desc',
      });
      const list = Array.isArray(result) ? result : result?.data ?? [];
      setCustomers(list);
      setMeta(result?.meta ?? { page: 1, totalPages: 1, total: list.length });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [page, search, activeFilter, verifiedFilter]);
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-enugu-black">Customers</h1>
        <p className="mt-1 text-sm text-gray-500">
          View registered customers, order history, and account status.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, or phone..."
            className="w-full max-w-md rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold"
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
            value={activeFilter}
            onChange={(e) => {
              setActiveFilter(e.target.value);
              setPage(1);
            }}
            className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold"
          >
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={verifiedFilter}
            onChange={(e) => {
              setVerifiedFilter(e.target.value);
              setPage(1);
            }}
            className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold"
          >
            {VERIFIED_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <CustomerTable customers={customers} loading={loading} />

      {meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
          <p>
            Page {meta.page} of {meta.totalPages} ({meta.total} customers)
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
    </div>
  );
};

export default AdminCustomersPage;
