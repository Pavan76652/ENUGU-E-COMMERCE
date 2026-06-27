import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { campaignApi } from '../../../services/campaignApi';
import { ROUTES } from '../../../config/routes';

// Admin preview of the currently live campaign banner (the same artwork shown
// on the storefront). Fetches its own data since admin pages are outside the
// storefront CampaignProvider.
const AdminActiveCampaignBanner = () => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    campaignApi
      .getActive()
      .then((result) => {
        if (active) setCampaign(result?.campaign ?? result ?? null);
      })
      .catch(() => {
        if (active) setCampaign(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <div className="h-40 animate-pulse rounded-lg bg-gray-200" />;
  }

  if (!campaign) {
    return (
      <section className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">
          Active Campaign
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          No live campaign right now.{' '}
          <Link to={ROUTES.ADMIN_CAMPAIGNS} className="font-medium text-enugu-gold hover:underline">
            Create one
          </Link>
          .
        </p>
      </section>
    );
  }

  const bannerUrl = campaign.bannerImage || campaign.mobileBannerImage;

  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between px-5 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-enugu-black">
          Active Campaign
        </h2>
        <Link
          to={ROUTES.ADMIN_CAMPAIGNS}
          className="text-xs font-medium uppercase tracking-wider text-enugu-gold hover:underline"
        >
          Manage
        </Link>
      </div>

      {bannerUrl ? (
        <img src={bannerUrl} alt={campaign.name} className="h-44 w-full object-cover" />
      ) : (
        <div className="flex h-44 items-center justify-center border-y border-dashed border-gray-200 bg-gray-50 px-4 text-center text-sm text-gray-400">
          No banner uploaded yet — add one in Campaigns so it shows on the storefront.
        </div>
      )}

      <div className="px-5 py-4">
        <p className="text-xs uppercase tracking-[0.2em] text-enugu-gold">{campaign.name}</p>
        {campaign.couponCode && (
          <p className="mt-1 font-mono text-sm font-bold tracking-widest text-enugu-black">
            {campaign.couponCode}
          </p>
        )}
      </div>
    </section>
  );
};

export default AdminActiveCampaignBanner;
