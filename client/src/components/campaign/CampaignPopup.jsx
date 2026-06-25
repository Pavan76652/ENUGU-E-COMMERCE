import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCampaign } from '../../context/CampaignContext';
import { ROUTES } from '../../config/routes';

const POPUP_KEY_PREFIX = 'enugu_campaign_popup_dismissed_';

const CampaignPopup = () => {
  const { campaign, isActive, loading } = useCampaign();
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (loading || !isActive || !campaign) return;

    const key = `${POPUP_KEY_PREFIX}${campaign.id ?? campaign.slug}`;
    const dismissed = sessionStorage.getItem(key);

    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [loading, isActive, campaign]);

  const dismiss = () => {
    if (campaign) {
      sessionStorage.setItem(
        `${POPUP_KEY_PREFIX}${campaign.id ?? campaign.slug}`,
        '1'
      );
    }
    setVisible(false);
  };

  const copyCode = async () => {
    if (!campaign?.couponCode) return;
    try {
      await navigator.clipboard.writeText(campaign.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (!visible || !campaign) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-md overflow-hidden bg-enugu-white shadow-2xl">
        {campaign.bannerImage && (
          <div className="h-40 overflow-hidden sm:h-48">
            <img
              src={campaign.bannerImage}
              alt={campaign.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-enugu-black/70 text-enugu-white transition hover:bg-enugu-black"
          aria-label="Close"
        >
          ×
        </button>

        <div className="p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-enugu-gold">{campaign.name}</p>
          <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-enugu-black">
            Festive Offer
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{campaign.greetingMessage}</p>

          <div className="mt-6 border border-dashed border-enugu-gold bg-enugu-gold/5 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-gray-500">Your coupon code</p>
            <p className="mt-1 font-mono text-2xl font-bold tracking-widest text-enugu-black">
              {campaign.couponCode}
            </p>
            <button
              type="button"
              onClick={copyCode}
              className="mt-3 text-xs font-medium uppercase tracking-wider text-enugu-gold hover:underline"
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>

          <Link
            to={`${ROUTES.CART}?coupon=${campaign.couponCode}`}
            onClick={dismiss}
            className="mt-6 block w-full bg-enugu-black py-3.5 text-center text-xs font-medium uppercase tracking-[0.2em] text-enugu-white transition hover:bg-enugu-gold hover:text-enugu-black"
          >
            Shop Now
          </Link>

          <button
            type="button"
            onClick={dismiss}
            className="mt-3 w-full text-center text-xs uppercase tracking-wider text-gray-400 hover:text-enugu-black"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignPopup;
