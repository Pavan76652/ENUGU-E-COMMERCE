import { useState, useEffect, useCallback } from 'react';
import { couponApi } from '../../services/couponApi';
import { CouponForm, CouponTable } from '../../components/admin/coupon';

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await couponApi.admin.list({
        search: search || undefined,
        limit: 50,
      });
      setCoupons(Array.isArray(result) ? result : result?.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleCreate = async (payload) => {
    setSaving(true);
    setError('');
    try {
      await couponApi.admin.create(payload);
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (payload) => {
    if (!editingCoupon) return;
    setSaving(true);
    setError('');
    try {
      await couponApi.admin.update(editingCoupon._id ?? editingCoupon.id, payload);
      setEditingCoupon(null);
      fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    setError('');
    try {
      await couponApi.admin.delete(deleteTarget._id ?? deleteTarget.id);
      setDeleteTarget(null);
      fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete coupon');
    } finally {
      setSaving(false);
    }
  };

  const openCreate = () => {
    setEditingCoupon(null);
    setShowForm(true);
  };

  const openEdit = (coupon) => {
    setShowForm(false);
    setEditingCoupon(coupon);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-enugu-black">Coupon Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage percentage, fixed, and free shipping coupons.
          </p>
        </div>
        {!showForm && !editingCoupon && (
          <button
            type="button"
            onClick={openCreate}
            className="rounded bg-enugu-black px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-enugu-gold hover:text-enugu-black"
          >
            + Create Coupon
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {(showForm || editingCoupon) && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-enugu-black">
            {editingCoupon ? `Edit ${editingCoupon.code}` : 'New Coupon'}
          </h2>
          <CouponForm
            initialData={editingCoupon}
            isEditing={Boolean(editingCoupon)}
            loading={saving}
            onSubmit={editingCoupon ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingCoupon(null);
            }}
          />
        </div>
      )}

      {!showForm && !editingCoupon && (
        <>
          <div className="mb-4">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by coupon code..."
              className="w-full max-w-sm rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold sm:w-72"
            />
          </div>
          <CouponTable
            coupons={coupons}
            loading={loading}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        </>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-enugu-black">Delete Coupon</h3>
            <p className="mt-2 text-sm text-gray-600">
              Deactivate coupon <strong>{deleteTarget.code}</strong>? It will no longer be usable
              at checkout.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="rounded bg-red-600 px-4 py-2 text-xs font-medium uppercase tracking-wider text-white hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? 'Deleting...' : 'Delete'}
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

export default AdminCouponsPage;
