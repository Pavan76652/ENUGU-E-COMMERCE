import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productApi } from '../../services/productApi';
import { ProductForm } from '../../components/admin/product';
import { ROUTES } from '../../config/routes';

const AdminProductCreatePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    productApi.admin
      .getCategories()
      .then((result) => {
        const list = result?.data?.categories ?? result?.categories ?? [];
        setCategories(Array.isArray(list) ? list : []);
      })
      .catch(() => setCategories([]));
  }, []);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError('');
    try {
      const result = await productApi.admin.create(payload);
      const product = result?.data?.product ?? result?.product;
      const id = product?._id ?? product?.id;
      navigate(ROUTES.ADMIN_PRODUCT_EDIT.replace(':id', id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          to={ROUTES.ADMIN_PRODUCTS}
          className="text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-enugu-gold"
        >
          ← Back to products
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-enugu-black">Create Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add product details and upload images to Cloudinary before publishing.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <ProductForm
          categories={categories}
          images={images}
          onImagesChange={setImages}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={() => navigate(ROUTES.ADMIN_PRODUCTS)}
        />
      </div>
    </div>
  );
};

export default AdminProductCreatePage;
