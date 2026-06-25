import { useState, useEffect, useMemo } from 'react';
import {
  MEASUREMENT_FIELDS,
  SIZE_GUIDE_SIZES,
  parseMeasurementInput,
  measurementsToForm,
} from '../../../constants/sizeGuides';
import { hasSizeGuideImage } from '../../../utils/sizeGuideImage';
import SizeGuideImageManager from './SizeGuideImageManager';

const toFormValues = (sizeGuide) => ({
  name: sizeGuide?.name ?? '',
  isActive: sizeGuide?.isActive ?? true,
  isDefault: sizeGuide?.isDefault ?? false,
  image: sizeGuide?.image ?? null,
  ...measurementsToForm(sizeGuide?.measurements),
});

const SizeGuideForm = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
  loading = false,
  onImageChange,
}) => {
  const [form, setForm] = useState(toFormValues(initialData));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(toFormValues(initialData));
  }, [initialData]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const parsedMeasurements = useMemo(() => {
    const measurements = {};
    MEASUREMENT_FIELDS.forEach(({ key }) => {
      measurements[key] = parseMeasurementInput(form[key]);
    });
    return measurements;
  }, [form]);

  const validate = () => {
    const next = {};
    const hasImage = hasSizeGuideImage({ image: form.image });

    if (!form.name.trim() || form.name.trim().length < 2) {
      next.name = 'Name must be at least 2 characters';
    }

    const measurementsComplete = MEASUREMENT_FIELDS.every(
      ({ key }) => parsedMeasurements[key].length === SIZE_GUIDE_SIZES.length
    );

    if (!hasImage && !measurementsComplete) {
      MEASUREMENT_FIELDS.forEach(({ key, label }) => {
        if (parsedMeasurements[key].length !== SIZE_GUIDE_SIZES.length) {
          next[key] = `Enter ${SIZE_GUIDE_SIZES.length} values for ${label}`;
        }
      });
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const measurementsComplete = MEASUREMENT_FIELDS.every(
      ({ key }) => parsedMeasurements[key].length === SIZE_GUIDE_SIZES.length
    );

    onSubmit({
      name: form.name.trim(),
      isActive: form.isActive,
      isDefault: form.isDefault,
      ...(measurementsComplete ? { measurements: parsedMeasurements } : {}),
    });
  };

  const inputClass = (field) =>
    `w-full rounded border px-3 py-2 text-sm outline-none focus:border-enugu-gold ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Size guide name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          className={inputClass('name')}
          placeholder="Oversized T-Shirt"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      <SizeGuideImageManager
        sizeGuideId={initialData?._id ?? initialData?.id}
        image={form.image}
        disabled={loading}
        onImageChange={(image) => {
          setForm((prev) => ({ ...prev, image }));
          onImageChange?.(image);
        }}
      />

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
          Measurements (inches)
        </p>
        <p className="mb-4 text-xs text-gray-400">
          Enter comma-separated values for sizes: {SIZE_GUIDE_SIZES.join(', ')}. Optional when a size guide image is uploaded.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {MEASUREMENT_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
              <input
                type="text"
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
                className={inputClass(key)}
                placeholder={SIZE_GUIDE_SIZES.map((_, index) => 40 + index).join(',')}
              />
              {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Measurement
              </th>
              {SIZE_GUIDE_SIZES.map((size) => (
                <th
                  key={size}
                  className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {size}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MEASUREMENT_FIELDS.map(({ key, label }) => (
              <tr key={key}>
                <td className="px-3 py-2 font-medium text-gray-700">{label}</td>
                {SIZE_GUIDE_SIZES.map((size, index) => (
                  <td key={size} className="px-3 py-2 text-center text-gray-600">
                    {parsedMeasurements[key][index] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => update('isDefault', e.target.checked)}
          className="rounded border-gray-300 text-enugu-gold focus:ring-enugu-gold"
        />
        Use as global ENUGU default size guide
      </label>

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => update('isActive', e.target.checked)}
          className="rounded border-gray-300 text-enugu-gold focus:ring-enugu-gold"
        />
        Active (visible for product assignment)
      </label>

      <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-enugu-black px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-enugu-gold hover:text-enugu-black disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEditing ? 'Update size guide' : 'Create size guide'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded border border-gray-300 px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-gray-600 hover:border-enugu-black hover:text-enugu-black disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SizeGuideForm;
