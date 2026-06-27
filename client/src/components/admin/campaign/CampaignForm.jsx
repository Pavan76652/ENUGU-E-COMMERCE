import { useState, useEffect } from 'react';
import {
  FESTIVAL_TYPES,
  FESTIVAL_TYPE_OPTIONS,
  FESTIVAL_PRESETS,
} from '../../../constants/campaignPresets';
import CampaignBannerUpload from './CampaignBannerUpload';

const toFormValues = (campaign) => ({
  festivalType: campaign?.festivalType ?? FESTIVAL_TYPES.DIWALI,
  name: campaign?.name ?? '',
  greetingMessage: campaign?.greetingMessage ?? '',
  couponCode: campaign?.couponCode ?? '',
  startDate: campaign?.startDate
    ? new Date(campaign.startDate).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10),
  endDate: campaign?.endDate
    ? new Date(campaign.endDate).toISOString().slice(0, 10)
    : '',
  usageLimit: '',
  minOrderValue: 0,
  isActive: campaign?.isActive ?? true,
  isFeatured: campaign?.isFeatured ?? true,
});

const CampaignForm = ({ initialData, onSubmit, onCancel, isEditing = false, loading = false }) => {
  const [form, setForm] = useState(toFormValues(initialData));
  const [errors, setErrors] = useState({});
  const [banners, setBanners] = useState({
    bannerImage: initialData?.bannerImage ?? null,
    mobileBannerImage: initialData?.mobileBannerImage ?? null,
    shopBannerImage: initialData?.shopBannerImage ?? null,
  });

  const campaignId = initialData?._id ?? initialData?.id ?? null;

  useEffect(() => {
    setForm(toFormValues(initialData));
    setBanners({
      bannerImage: initialData?.bannerImage ?? null,
      mobileBannerImage: initialData?.mobileBannerImage ?? null,
      shopBannerImage: initialData?.shopBannerImage ?? null,
    });
  }, [initialData]);

  const handleBannerChange = (updatedCampaign) => {
    setBanners({
      bannerImage: updatedCampaign?.bannerImage ?? null,
      mobileBannerImage: updatedCampaign?.mobileBannerImage ?? null,
      shopBannerImage: updatedCampaign?.shopBannerImage ?? null,
    });
  };

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const applyPreset = (type) => {
    const preset = FESTIVAL_PRESETS[type];
    if (!preset) {
      update('festivalType', type);
      return;
    }

    setForm((prev) => ({
      ...prev,
      festivalType: type,
      name: preset.name,
      greetingMessage: preset.greetingMessage,
      couponCode: preset.couponCode,
    }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Campaign name is required';
    if (!form.greetingMessage.trim()) next.greetingMessage = 'Greeting message is required';
    if (!form.couponCode.trim()) next.couponCode = 'Coupon code is required';
    if (!form.endDate) next.endDate = 'End date is required';
    if (form.endDate && form.startDate && new Date(form.endDate) <= new Date(form.startDate)) {
      next.endDate = 'End date must be after start date';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      festivalType: form.festivalType,
      greetingMessage: form.greetingMessage.trim(),
      couponCode: form.couponCode.trim().toUpperCase(),
      startDate: form.startDate,
      endDate: form.endDate,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
    };

    onSubmit(payload);
  };

  const inputClass = (field) =>
    `w-full rounded border px-3 py-2 text-sm outline-none focus:border-enugu-gold ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
          Festival Preset
        </label>
        <select
          value={form.festivalType}
          onChange={(e) => applyPreset(e.target.value)}
          className={inputClass('festivalType')}
        >
          {FESTIVAL_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
          Campaign Name
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          className={inputClass('name')}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
          Greeting Message
        </label>
        <textarea
          rows={3}
          value={form.greetingMessage}
          onChange={(e) => update('greetingMessage', e.target.value)}
          className={inputClass('greetingMessage')}
        />
        {errors.greetingMessage && (
          <p className="mt-1 text-xs text-red-500">{errors.greetingMessage}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
          Campaign Banners
        </label>
        {campaignId ? (
          <div className="space-y-3">
            <CampaignBannerUpload
              campaignId={campaignId}
              variant="desktop"
              label="Desktop Banner"
              ratioHint="Recommended 16:9 · 1920×1080px · JPG/PNG/WebP, max 5MB"
              image={banners.bannerImage}
              onChange={handleBannerChange}
              disabled={loading}
            />
            <CampaignBannerUpload
              campaignId={campaignId}
              variant="mobile"
              label="Mobile Banner"
              ratioHint="Recommended 4:5 · 1080×1350px · JPG/PNG/WebP, max 5MB"
              image={banners.mobileBannerImage}
              onChange={handleBannerChange}
              disabled={loading}
            />
            <CampaignBannerUpload
              campaignId={campaignId}
              variant="shop"
              label="Shop Page Banner (wide strip)"
              ratioHint="Recommended 4:1 · 1600×400px · short wide strip shown on the Shop page"
              image={banners.shopBannerImage}
              onChange={handleBannerChange}
              disabled={loading}
            />
            <p className="text-xs text-gray-400">
              Design banners with text/logo included and keep key content centered. Desktop banner =
              homepage on computers, Mobile banner = homepage on phones, Shop banner = the short wide
              strip on the Shop page.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm text-gray-500">
            Save the campaign first, then upload the desktop and mobile banners here.
          </div>
        )}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
          Coupon Code
        </label>
        <input
          type="text"
          value={form.couponCode}
          onChange={(e) => update('couponCode', e.target.value.toUpperCase())}
          className={`${inputClass('couponCode')} uppercase`}
        />
        {errors.couponCode && <p className="mt-1 text-xs text-red-500">{errors.couponCode}</p>}
        <p className="mt-1 text-xs text-gray-400">Create the coupon in Coupons module first for auto-linking.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
            Start Date
          </label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => update('startDate', e.target.value)}
            className={inputClass('startDate')}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
            End Date
          </label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => update('endDate', e.target.value)}
            className={inputClass('endDate')}
          />
          {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => update('isActive', e.target.checked)}
            className="accent-enugu-gold"
          />
          Active
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => update('isFeatured', e.target.checked)}
            className="accent-enugu-gold"
          />
          Featured (priority on homepage)
        </label>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-enugu-black px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-enugu-gold hover:text-enugu-black disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Campaign' : 'Create Campaign'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-gray-300 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CampaignForm;
