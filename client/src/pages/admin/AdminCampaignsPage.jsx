import { useState, useEffect, useCallback } from 'react';
import { campaignApi } from '../../services/campaignApi';
import { CampaignForm, CampaignTable } from '../../components/admin/campaign';

const AdminCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await campaignApi.admin.list({
        search: search || undefined,
        limit: 50,
      });
      setCampaigns(Array.isArray(result) ? result : result?.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleCreate = async (payload) => {
    setSaving(true);
    setError('');
    try {
      await campaignApi.admin.create(payload);
      setShowForm(false);
      fetchCampaigns();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create campaign');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (payload) => {
    if (!editingCampaign) return;
    setSaving(true);
    setError('');
    try {
      await campaignApi.admin.update(editingCampaign._id ?? editingCampaign.id, payload);
      setEditingCampaign(null);
      fetchCampaigns();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update campaign');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await campaignApi.admin.delete(deleteTarget._id ?? deleteTarget.id);
      setDeleteTarget(null);
      fetchCampaigns();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete campaign');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-enugu-black">Festival Campaigns</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage Independence Day, Dasara, Diwali, New Year and custom sales. Campaigns auto-activate
            between start and end dates.
          </p>
        </div>
        {!showForm && !editingCampaign && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded bg-enugu-black px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-enugu-gold hover:text-enugu-black"
          >
            + Create Campaign
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {(showForm || editingCampaign) && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-enugu-black">
            {editingCampaign ? `Edit ${editingCampaign.name}` : 'New Festival Campaign'}
          </h2>
          <CampaignForm
            initialData={editingCampaign}
            isEditing={Boolean(editingCampaign)}
            loading={saving}
            onSubmit={editingCampaign ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingCampaign(null);
            }}
          />
        </div>
      )}

      {!showForm && !editingCampaign && (
        <>
          <div className="mb-4">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaigns..."
              className="w-full max-w-sm rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold sm:w-72"
            />
          </div>
          <CampaignTable
            campaigns={campaigns}
            loading={loading}
            onEdit={setEditingCampaign}
            onDelete={setDeleteTarget}
          />
        </>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-enugu-black">Deactivate Campaign</h3>
            <p className="mt-2 text-sm text-gray-600">
              Deactivate <strong>{deleteTarget.name}</strong>? It will be removed from the storefront.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="rounded bg-red-600 px-4 py-2 text-xs font-medium uppercase tracking-wider text-white disabled:opacity-50"
              >
                {saving ? 'Deleting...' : 'Deactivate'}
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

export default AdminCampaignsPage;
