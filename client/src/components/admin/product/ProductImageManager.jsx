import { useState, useRef, useEffect, useMemo } from 'react';
import { productApi } from '../../../services/productApi';
import { IMAGE_TYPE_OPTIONS, MIN_PRODUCT_IMAGES } from '../../../constants/products';
import { getImageTypeLabel, groupImagesByRole, sortProductImages } from '../../../utils/imageHelpers';

const suggestImageType = (images) => {
  if (!images.some((img) => img.type === 'front_view')) return 'front_view';
  if (!images.some((img) => img.type === 'back_view')) return 'back_view';
  return 'additional';
};

const mergeUploadedImages = (existing, uploaded, imageType) => {
  const hasCover = existing.some((img) => img.isCover);
  const newItems = uploaded.map((img, index) => ({
    ...img,
    type: img.type ?? imageType,
    sortOrder: existing.length + index,
    isCover:
      (!hasCover && imageType === 'front_view' && index === 0) ||
      (existing.length === 0 && index === 0),
  }));

  const merged = [...existing, ...newItems].slice(0, 10);
  if (!merged.some((img) => img.isCover) && merged.length > 0) {
    return merged.map((img, index) => ({ ...img, isCover: index === 0 }));
  }
  return merged;
};

const ImageCard = ({ img, disabled, uploading, onSetCover, onDelete }) => (
  <div
    className={`relative overflow-hidden rounded-lg border ${
      img.isCover ? 'border-enugu-gold ring-2 ring-enugu-gold' : 'border-gray-200'
    }`}
  >
    <img src={img.url} alt={img.alt || ''} className="aspect-[3/4] w-full object-cover" />
    <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-medium uppercase text-white">
      {getImageTypeLabel(img.type)}
    </span>
    {img.isCover && (
      <span className="absolute right-2 top-2 rounded bg-enugu-gold px-2 py-0.5 text-[10px] font-medium uppercase text-enugu-black">
        Cover
      </span>
    )}
    <div className="flex gap-1 border-t border-gray-100 bg-white p-2">
      {!img.isCover && (
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => onSetCover(img.publicId)}
          className="flex-1 text-[10px] font-medium uppercase tracking-wider text-enugu-black hover:text-enugu-gold disabled:opacity-50"
        >
          Cover
        </button>
      )}
      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => onDelete(img.publicId)}
        className="flex-1 text-[10px] font-medium uppercase tracking-wider text-red-600 hover:text-red-800 disabled:opacity-50"
      >
        Remove
      </button>
    </div>
  </div>
);

const ProductImageManager = ({
  productId,
  images = [],
  onImagesChange,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageType, setImageType] = useState('front_view');
  const fileRef = useRef(null);

  useEffect(() => {
    setImageType(suggestImageType(images));
  }, [images]);

  useEffect(() => {
    if (!success) return undefined;
    const timer = setTimeout(() => setSuccess(''), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  const grouped = useMemo(() => groupImagesByRole(images), [images]);
  const sortedImages = useMemo(() => sortProductImages(images), [images]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    formData.append('type', imageType);

    try {
      if (productId) {
        const result = await productApi.admin.uploadImages(productId, formData);
        const product = result?.data?.product ?? result?.product;
        onImagesChange(product?.images ?? []);
      } else {
        const result = await productApi.admin.uploadStandaloneImages(formData);
        const uploaded = result?.data?.images ?? result?.images ?? [];
        onImagesChange(mergeUploadedImages(images, uploaded, imageType));
      }
      setSuccess(`${files.length} image${files.length > 1 ? 's' : ''} uploaded successfully.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (publicId) => {
    if (!window.confirm('Remove this image?')) return;

    if (productId) {
      setUploading(true);
      setError('');
      setSuccess('');
      try {
        const result = await productApi.admin.deleteImage(productId, { publicId });
        const product = result?.data?.product ?? result?.product;
        onImagesChange(product?.images ?? []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete image');
      } finally {
        setUploading(false);
      }
    } else {
      onImagesChange(images.filter((img) => img.publicId !== publicId));
    }
  };

  const handleSetCover = async (publicId) => {
    if (productId) {
      setUploading(true);
      setError('');
      try {
        const result = await productApi.admin.setCoverImage(productId, { publicId });
        const product = result?.data?.product ?? result?.product;
        onImagesChange(product?.images ?? []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to set cover image');
      } finally {
        setUploading(false);
      }
    } else {
      onImagesChange(
        images.map((img) => ({ ...img, isCover: img.publicId === publicId }))
      );
    }
  };

  const renderSection = (title, sectionImages) => {
    if (!sectionImages.length) return null;
    return (
      <div className="mb-6">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-600">{title}</h4>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {sectionImages.map((img) => (
            <ImageCard
              key={img.publicId}
              img={img}
              disabled={disabled}
              uploading={uploading}
              onSetCover={handleSetCover}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Product images</p>
          <p className="mt-1 text-xs text-gray-400">
            Upload front view, back view, and gallery images. Minimum {MIN_PRODUCT_IMAGES} to publish.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={imageType}
            onChange={(e) => setImageType(e.target.value)}
            disabled={disabled || uploading}
            className="rounded border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-enugu-gold"
          >
            {IMAGE_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <label
            className={`cursor-pointer rounded bg-enugu-black px-4 py-2 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-enugu-gold hover:text-enugu-black ${
              disabled || uploading ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            {uploading ? 'Uploading...' : '+ Upload'}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              disabled={disabled || uploading}
              onChange={handleUpload}
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {success}
        </div>
      )}

      {images.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-10 text-center text-sm text-gray-400">
          No images yet. Upload front view, back view, and gallery images before publishing.
        </div>
      ) : (
        <div>
          {grouped.front || grouped.back ? (
            <>
              {grouped.front &&
                renderSection('Front View', [grouped.front])}
              {grouped.back &&
                renderSection('Back View', [grouped.back])}
              {renderSection(
                'Gallery Images',
                sortedImages.filter(
                  (img) =>
                    img.publicId !== grouped.front?.publicId &&
                    img.publicId !== grouped.back?.publicId
                )
              )}
            </>
          ) : (
            renderSection('All images', sortedImages)
          )}
        </div>
      )}
    </div>
  );
};

export default ProductImageManager;
