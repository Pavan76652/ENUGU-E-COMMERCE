import { useState, useEffect, useCallback } from 'react';
import { sizeGuideApi } from '../../services/sizeGuideApi';
import { SizeGuideForm, SizeGuideTable } from '../../components/admin/sizeGuide';

const AdminSizeGuidesPage = () => {
  const [sizeGuides, setSizeGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchSizeGuides = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await sizeGuideApi.admin.list({
        search: search || undefined,
        limit: 50,
      });
      setSizeGuides(Array.isArray(result) ? result : result?.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load size guides');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchSizeGuides();
  }, [fetchSizeGuides]);

  const handleCreate = async (payload) => {
    setSaving(true);
    setError('');
    try {
      const result = await sizeGuideApi.admin.create(payload);
      setShowForm(false);
      setEditingGuide(result.sizeGuide ?? result);
      fetchSizeGuides();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create size guide');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (payload) => {
    if (!editingGuide) return;
    setSaving(true);
    setError('');
    try {
      await sizeGuideApi.admin.update(editingGuide._id ?? editingGuide.id, payload);
      setEditingGuide(null);
      fetchSizeGuides();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update size guide');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    setError('');
    try {
      await sizeGuideApi.admin.delete(deleteTarget._id ?? deleteTarget.id);
      setDeleteTarget(null);
      fetchSizeGuides();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete size guide');
    } finally {
      setSaving(false);
    }
  };

  const openCreate = () => {
    setEditingGuide(null);
    setShowForm(true);
  };

  const openEdit = (guide) => {
    setShowForm(false);
    setEditingGuide(guide);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-enugu-black">Size Guide Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload premium ENUGU size guide images, manage global defaults, and measurement fallbacks.
          </p>
        </div>
        {!showForm && !editingGuide && (
          <button
            type="button"
            onClick={openCreate}
            className="rounded bg-enugu-black px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-enugu-gold hover:text-enugu-black"
          >
            + Create Size Guide
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {(showForm || editingGuide) && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-enugu-black">
            {editingGuide ? `Edit ${editingGuide.name}` : 'New Size Guide'}
          </h2>
          <SizeGuideForm
            initialData={editingGuide}
            isEditing={Boolean(editingGuide)}
            loading={saving}
            onSubmit={editingGuide ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingGuide(null);
            }}
          />
        </div>
      )}

      {!showForm && !editingGuide && (
        <>
          <div className="mb-4">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search size guides..."
              className="w-full max-w-sm rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold sm:w-72"
            />
          </div>
          <SizeGuideTable
            sizeGuides={sizeGuides}
            loading={loading}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        </>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-enugu-black">Delete Size Guide</h3>
            <p className="mt-2 text-sm text-gray-600">
              Permanently delete <strong>{deleteTarget.name}</strong>? Products using this guide
              must be reassigned first.
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

export default AdminSizeGuidesPage;
