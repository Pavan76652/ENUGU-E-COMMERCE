import { useEffect, useRef, useState } from 'react';
import { campaignApi } from '../../../services/campaignApi';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

const CampaignBannerUpload = ({
  campaignId,
  variant,
  label,
  ratioHint,
  image,
  onChange,
  disabled = false,
}) => {
  const fileRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const currentUrl = previewUrl || image?.url || '';

  const handleSelect = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Only JPEG, PNG, or WebP images are allowed');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('Image must be 5MB or smaller');
      return;
    }

    if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
  };

  const handleUpload = async () => {
    if (!campaignId || !selectedFile) return;
    setUploading(true);
    setError('');
    try {
      const result = await campaignApi.admin.uploadBanner(campaignId, selectedFile, variant);
      const updated = result.campaign ?? result;
      onChange?.(updated);
      setSelectedFile(null);
      if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload banner');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!campaignId || !image?.url) return;
    if (!window.confirm('Remove this banner image?')) return;
    setUploading(true);
    setError('');
    try {
      const result = await campaignApi.admin.deleteBanner(campaignId, variant);
      const updated = result.campaign ?? result;
      onChange?.(updated);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove banner');
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setSelectedFile(null);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-enugu-black">
            {label}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">{ratioHint}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => fileRef.current?.click()}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-enugu-black transition hover:border-enugu-black disabled:opacity-50"
          >
            {image?.url ? 'Replace' : 'Choose Image'}
          </button>
          {image?.url && !selectedFile && (
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={handleDelete}
              className="rounded border border-red-200 bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-red-600 transition hover:border-red-400 disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleSelect}
      />

      <div className="mt-3">
        {currentUrl ? (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <img src={currentUrl} alt={`${label} preview`} className="w-full object-contain" />
          </div>
        ) : (
          <div className="flex min-h-[120px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-xs text-gray-400">
            No banner uploaded yet
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={handleUpload}
            className="rounded bg-enugu-black px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider text-white transition hover:bg-enugu-gold hover:text-enugu-black disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Save Banner'}
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={clearPreview}
            className="rounded border border-gray-300 px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider text-gray-600 disabled:opacity-50"
          >
            Cancel
          </button>
          <span className="text-xs text-gray-500">{selectedFile.name}</span>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default CampaignBannerUpload;
