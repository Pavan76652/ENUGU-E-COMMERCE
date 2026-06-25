import { useState, useEffect } from 'react';
import {
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_STATUSES,
  defaultSizeStock,
  MIN_PRODUCT_IMAGES,
} from '../../../constants/products';
import { SIZE_GUIDE_CUSTOM_VALUE } from '../../../constants/sizeGuides';
import { sizeGuideApi } from '../../../services/sizeGuideApi';
import InventoryEditor from './InventoryEditor';
import ProductImageManager from './ProductImageManager';

const toFormValues = (product) => ({
  name: product?.name ?? '',
  sku: product?.sku ?? '',
  description: product?.description ?? '',
  categoryId: product?.categoryId?._id ?? product?.categoryId ?? '',
  sizeGuideId:
    product?.sizeGuideId?._id ??
    product?.sizeGuideId ??
    SIZE_GUIDE_CUSTOM_VALUE,
  mrp: product?.mrp ?? '',
  sellingPrice: product?.sellingPrice ?? '',
  sizeStock: product?.sizeStock?.length ? product.sizeStock : defaultSizeStock(),
  status: product?.status ?? PRODUCT_STATUSES.DRAFT,
  brand: product?.brand ?? 'ENUGU',
  tags: Array.isArray(product?.tags) ? product.tags.join(', ') : '',
  isFeatured: product?.isFeatured ?? false,
  isNewArrival: product?.isNewArrival ?? false,
  metaTitle: product?.metaTitle ?? product?.seo?.metaTitle ?? '',
  metaDescription: product?.metaDescription ?? product?.seo?.metaDescription ?? '',
});

const ProductForm = ({
  initialData,
  categories = [],
  images = [],
  onImagesChange,
  productId,
  isEditing = false,
  loading = false,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState(toFormValues(initialData));
  const [errors, setErrors] = useState({});
  const [sizeGuideOptions, setSizeGuideOptions] = useState([]);

  useEffect(() => {
    setForm(toFormValues(initialData));
  }, [initialData]);

  useEffect(() => {
    sizeGuideApi.admin
      .getOptions()
      .then((result) => {
        const list = result?.sizeGuides ?? result?.data?.sizeGuides ?? [];
        setSizeGuideOptions(Array.isArray(list) ? list : []);
      })
      .catch(() => setSizeGuideOptions([]));
  }, []);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      next.name = 'Name must be at least 2 characters';
    }
    if (!form.sku.trim() || form.sku.trim().length < 2) {
      next.sku = 'SKU is required';
    }
    if (!form.description.trim() || form.description.trim().length < 10) {
      next.description = 'Description must be at least 10 characters';
    }
    if (!form.categoryId) {
      next.categoryId = 'Category is required';
    }
    if (!form.mrp || Number(form.mrp) <= 0) {
      next.mrp = 'MRP must be greater than 0';
    }
    if (!form.sellingPrice || Number(form.sellingPrice) <= 0) {
      next.sellingPrice = 'Selling price must be greater than 0';
    } else if (Number(form.sellingPrice) > Number(form.mrp)) {
      next.sellingPrice = 'Selling price cannot exceed MRP';
    }

    const publishStatuses = [PRODUCT_STATUSES.PUBLISHED, PRODUCT_STATUSES.SOLD_OUT];
    if (publishStatuses.includes(form.status) && images.length < MIN_PRODUCT_IMAGES) {
      next.images = `At least ${MIN_PRODUCT_IMAGES} images required to publish`;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      description: form.description.trim(),
      categoryId: form.categoryId,
      mrp: Number(form.mrp),
      sellingPrice: Number(form.sellingPrice),
      sizeStock: form.sizeStock.map((row) => ({
        size: row.size,
        stock: Number(row.stock) || 0,
        lowStockThreshold: Number(row.lowStockThreshold) ?? 5,
      })),
      status: form.status,
      brand: form.brand.trim() || 'ENUGU',
      tags,
      isFeatured: form.isFeatured,
      isNewArrival: form.isNewArrival,
    };

    if (form.metaTitle.trim()) payload.metaTitle = form.metaTitle.trim();
    if (form.metaDescription.trim()) payload.metaDescription = form.metaDescription.trim();

    payload.sizeGuideId =
      form.sizeGuideId && form.sizeGuideId !== SIZE_GUIDE_CUSTOM_VALUE ? form.sizeGuideId : null;

    if (images.length > 0) {
      payload.images = images.map((img, index) => ({
        url: img.url,
        publicId: img.publicId,
        type: img.type ?? 'additional',
        alt: img.alt ?? form.name.trim(),
        sortOrder: img.sortOrder ?? index,
        isCover: Boolean(img.isCover),
      }));
    }

    onSubmit(payload);
  };

  const inputClass = (field) =>
    `w-full rounded border px-3 py-2 text-sm outline-none focus:border-enugu-gold ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-enugu-black">
          Basic information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Product name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className={inputClass('name')}
              placeholder="Oversized Graphic Tee"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">SKU</label>
            <input
              type="text"
              value={form.sku}
              onChange={(e) => update('sku', e.target.value.toUpperCase())}
              className={inputClass('sku')}
              placeholder="ENUGU-TEE-001"
              disabled={isEditing}
            />
            {errors.sku && <p className="mt-1 text-xs text-red-600">{errors.sku}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => update('categoryId', e.target.value)}
              className={inputClass('categoryId')}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id ?? cat.id} value={cat._id ?? cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>}
            {!categories.length && (
              <p className="mt-1 text-xs text-amber-600">No categories found. Restart server to seed defaults.</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={4}
              className={inputClass('description')}
              placeholder="Describe fabric, fit, print details..."
            />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-enugu-black">Pricing</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">MRP (₹)</label>
            <input
              type="number"
              min="1"
              step="1"
              value={form.mrp}
              onChange={(e) => update('mrp', e.target.value)}
              className={inputClass('mrp')}
            />
            {errors.mrp && <p className="mt-1 text-xs text-red-600">{errors.mrp}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Selling price (₹)</label>
            <input
              type="number"
              min="1"
              step="1"
              value={form.sellingPrice}
              onChange={(e) => update('sellingPrice', e.target.value)}
              className={inputClass('sellingPrice')}
            />
            {errors.sellingPrice && <p className="mt-1 text-xs text-red-600">{errors.sellingPrice}</p>}
          </div>
        </div>
      </section>

      <section>
        <InventoryEditor
          sizeStock={form.sizeStock}
          onChange={(sizeStock) => update('sizeStock', sizeStock)}
          errors={errors}
        />
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-enugu-black">
          Size guide
        </h3>
        <div className="max-w-md">
          <label className="mb-1 block text-xs font-medium text-gray-600">Attach size guide</label>
          <select
            value={form.sizeGuideId}
            onChange={(e) => update('sizeGuideId', e.target.value)}
            className={inputClass('sizeGuideId')}
          >
            <option value={SIZE_GUIDE_CUSTOM_VALUE}>Custom (No guide)</option>
            {sizeGuideOptions.map((guide) => (
              <option key={guide._id ?? guide.id} value={guide._id ?? guide.id}>
                {guide.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-400">
            Manage guides in Admin → Size Guide Management. Customers see the premium image on the product page.
          </p>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-enugu-black">
          Images & media
        </h3>
        {onImagesChange && (
          <>
            <ProductImageManager
              productId={productId}
              images={images}
              onImagesChange={onImagesChange}
              disabled={loading}
            />
            {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
          </>
        )}
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-enugu-black">
          Visibility & SEO
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
            <select
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
              className={inputClass('status')}
            >
              {PRODUCT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Brand</label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => update('brand', e.target.value)}
              className={inputClass('brand')}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Tags (comma-separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => update('tags', e.target.value)}
              className={inputClass('tags')}
              placeholder="oversized, graphic, cotton"
            />
          </div>
          <div className="flex flex-wrap gap-6 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => update('isFeatured', e.target.checked)}
                className="rounded border-gray-300 text-enugu-gold focus:ring-enugu-gold"
              />
              Featured product
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.isNewArrival}
                onChange={(e) => update('isNewArrival', e.target.checked)}
                className="rounded border-gray-300 text-enugu-gold focus:ring-enugu-gold"
              />
              New arrival
            </label>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Meta title (max 70)</label>
            <input
              type="text"
              maxLength={70}
              value={form.metaTitle}
              onChange={(e) => update('metaTitle', e.target.value)}
              className={inputClass('metaTitle')}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Meta description (max 160)</label>
            <textarea
              maxLength={160}
              rows={2}
              value={form.metaDescription}
              onChange={(e) => update('metaDescription', e.target.value)}
              className={inputClass('metaDescription')}
            />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-enugu-black px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-enugu-gold hover:text-enugu-black disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded border border-gray-300 px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-gray-600 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
