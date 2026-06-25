import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { productApi } from '../../services/productApi';
import { ProductForm, ProductStatusBadge } from '../../components/admin/product';
import { ROUTES } from '../../config/routes';

const AdminProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [productResult, categoriesResult] = await Promise.all([
        productApi.admin.getById(id),
        productApi.admin.getCategories(),
      ]);
      const p = productResult?.data?.product ?? productResult?.product;
      if (!p) throw new Error('Product not found');
      setProduct(p);
      setImages(p.images ?? []);
      const cats = categoriesResult?.data?.categories ?? categoriesResult?.categories ?? [];
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleSubmit = async (payload) => {
    setSaving(true);
    setError('');
    try {
      const result = await productApi.admin.update(id, payload);
      const updated = result?.data?.product ?? result?.product;
      setProduct(updated);
      setImages(updated?.images ?? images);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleImagesChange = (nextImages) => {
    setImages(nextImages);
    if (product) {
      setProduct((prev) => ({ ...prev, images: nextImages }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-enugu-gold border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-gray-500">{error || 'Product not found'}</p>
        <Link
          to={ROUTES.ADMIN_PRODUCTS}
          className="mt-4 inline-block text-xs font-medium uppercase tracking-wider text-enugu-gold hover:underline"
        >
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to={ROUTES.ADMIN_PRODUCTS}
          className="text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-enugu-gold"
        >
          ← Back to products
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-enugu-black">{product.name}</h1>
          <ProductStatusBadge status={product.status} />
        </div>
        <p className="mt-1 font-mono text-xs text-gray-400">
          SKU: {product.sku} · Slug: {product.slug}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <ProductForm
          initialData={product}
          categories={categories}
          images={images}
          onImagesChange={handleImagesChange}
          productId={id}
          isEditing
          loading={saving}
          onSubmit={handleSubmit}
          onCancel={() => navigate(ROUTES.ADMIN_PRODUCTS)}
        />
      </div>
    </div>
  );
};

export default AdminProductEditPage;
