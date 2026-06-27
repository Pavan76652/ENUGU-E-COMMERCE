import { Link } from 'react-router-dom';
import { useCampaign } from '../../context/CampaignContext';
import { ROUTES } from '../../config/routes';

// Compact campaign poster for inner pages (e.g. Shop). Shows the uploaded
// banner artwork at a small height; falls back to nothing when no campaign
// banner is set so the page stays clean.
const CampaignStrip = ({ className = '' }) => {
  const { campaign, isActive } = useCampaign();

  // Prefer the dedicated wide Shop banner; fall back to the hero banners.
  const shopUrl = campaign?.shopBannerImage;
  const fallbackUrl = campaign?.bannerImage || campaign?.mobileBannerImage;
  const imageUrl = shopUrl || fallbackUrl;

  if (!isActive || !imageUrl) return null;

  const saleLink = campaign.couponCode
    ? `${ROUTES.CART}?coupon=${campaign.couponCode}`
    : ROUTES.SHOP;

  // A dedicated shop banner is already sized for the strip, so show it fully
  // (contain). A fallback hero banner is taller, so crop it (cover).
  const fitClass = shopUrl ? 'object-contain' : 'object-cover';

  return (
    <Link
      to={saleLink}
      aria-label={`${campaign.name} — shop the sale`}
      className={`group relative block overflow-hidden rounded-lg bg-enugu-black ${className}`}
    >
      <img
        src={imageUrl}
        alt={campaign.name}
        loading="lazy"
        decoding="async"
        className={`h-24 w-full ${fitClass} transition-transform duration-500 group-hover:scale-105 sm:h-32 md:h-40`}
      />

      {campaign.couponCode && (
        <span className="absolute right-3 top-3 rounded-full bg-enugu-gold px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-enugu-black">
          {campaign.couponCode}
        </span>
      )}
    </Link>
  );
};

export default CampaignStrip;
