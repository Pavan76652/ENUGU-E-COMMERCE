import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../services/productApi';
import { ProductTable } from '../../components/admin/product';
import { PRODUCT_STATUS_OPTIONS } from '../../constants/products';
import { ROUTES } from '../../config/routes';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await productApi.admin.list({
        page,
        limit: 20,
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      const list = Array.isArray(result) ? result : result?.data ?? [];
      setProducts(list);
      setMeta(result?.meta ?? { page: 1, totalPages: 1, total: list.length });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleStatusChange = async (product, status) => {
    const id = product._id ?? product.id;
    setActionLoading(true);
    setError('');
    try {
      await productApi.admin.updateStatus(id, { status });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchive = async (product) => {
    if (!window.confirm(`Archive "${product.name}"?`)) return;
    const id = product._id ?? product.id;
    setActionLoading(true);
    setError('');
    try {
      await productApi.admin.archive(id);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to archive product');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id ?? deleteTarget.id;
    setActionLoading(true);
    setError('');
    try {
      await productApi.admin.delete(id);
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-enugu-black">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage catalog, inventory, images, and publishing status.
          </p>
        </div>
        <Link
          to={ROUTES.ADMIN_PRODUCT_CREATE}
          className="inline-flex justify-center rounded bg-enugu-black px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-enugu-gold hover:text-enugu-black"
        >
          + Add Product
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full max-w-sm rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold"
          />
          <button
            type="submit"
            className="rounded border border-gray-300 px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-600 hover:border-enugu-gold"
          >
            Search
          </button>
        </form>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold"
        >
          <option value="">All statuses</option>
          {PRODUCT_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <ProductTable
        products={products}
        loading={loading || actionLoading}
        onStatusChange={handleStatusChange}
        onArchive={handleArchive}
        onDelete={setDeleteTarget}
      />

      {meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
          <p>
            Page {meta.page} of {meta.totalPages} ({meta.total} products)
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

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-enugu-black">Delete Product</h3>
            <p className="mt-2 text-sm text-gray-600">
              Permanently delete <strong>{deleteTarget.name}</strong>? This cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={actionLoading}
                className="rounded bg-red-600 px-4 py-2 text-xs font-medium uppercase tracking-wider text-white hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
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

export default AdminProductsPage;
