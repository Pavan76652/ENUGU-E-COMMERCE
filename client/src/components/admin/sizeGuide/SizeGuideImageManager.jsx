import { useEffect, useRef, useState } from 'react';
import { sizeGuideApi } from '../../../services/sizeGuideApi';
import { getOptimizedSizeGuideImageUrl } from '../../../utils/sizeGuideImage';

const SizeGuideImageManager = ({ sizeGuideId, image, onImageChange, disabled = false }) => {
  const fileRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!success) return undefined;
    const timer = setTimeout(() => setSuccess(''), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  const currentUrl = previewUrl || (image?.url ? getOptimizedSizeGuideImageUrl(image.url, { width: 900 }) : '');

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be 5MB or smaller');
      return;
    }

    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
    setSuccess('');
    event.target.value = '';
  };

  const handleUpload = async () => {
    if (!sizeGuideId || !selectedFile) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const result = await sizeGuideApi.admin.uploadImage(sizeGuideId, selectedFile);
      const updatedGuide = result.sizeGuide ?? result;
      onImageChange?.(updatedGuide.image ?? null);
      setSelectedFile(null);
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl('');
      setSuccess('Size guide image saved');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload size guide image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!sizeGuideId || !image?.url) return;
    if (!window.confirm('Remove this size guide image?')) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      await sizeGuideApi.admin.deleteImage(sizeGuideId);
      onImageChange?.(null);
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl('');
      setSelectedFile(null);
      setSuccess('Size guide image removed');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete size guide image');
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setSelectedFile(null);
  };

  if (!sizeGuideId) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm text-gray-500">
        Save the size guide first, then upload a premium size guide image.
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-enugu-black">
            Size Guide Image
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Upload, preview, replace, or delete the storefront size guide image.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => fileRef.current?.click()}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-xs font-medium uppercase tracking-wider text-enugu-black transition hover:border-enugu-black disabled:opacity-50"
          >
            {image?.url ? 'Replace Image' : 'Upload Image'}
          </button>
          {image?.url && !selectedFile && (
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={handleDelete}
              className="rounded border border-red-200 bg-white px-4 py-2 text-xs font-medium uppercase tracking-wider text-red-600 transition hover:border-red-400 disabled:opacity-50"
            >
              Delete Image
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />

      {currentUrl ? (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <img
            src={currentUrl}
            alt="Size guide preview"
            className="max-h-[420px] w-full object-contain"
          />
        </div>
      ) : (
        <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white text-sm text-gray-400">
          No image uploaded yet
        </div>
      )}

      {selectedFile && (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={handleUpload}
            className="rounded bg-enugu-black px-5 py-2 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-enugu-gold hover:text-enugu-black disabled:opacity-50"
          >
            {uploading ? 'Saving...' : 'Save Image'}
          </button>
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={clearPreview}
            className="rounded border border-gray-300 px-5 py-2 text-xs font-medium uppercase tracking-wider text-gray-600 disabled:opacity-50"
          >
            Cancel Preview
          </button>
          <p className="text-xs text-gray-500">Preview before saving: {selectedFile.name}</p>
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
      {success && <p className="text-xs text-green-700">{success}</p>}
    </div>
  );
};

export default SizeGuideImageManager;
