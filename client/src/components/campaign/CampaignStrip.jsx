import { Link } from 'react-router-dom';
import { useCampaign } from '../../context/CampaignContext';
import { ROUTES } from '../../config/routes';

// Compact campaign poster for inner pages (e.g. Shop). Shows the uploaded
// banner artwork at a small height; falls back to nothing when no campaign
// banner is set so the page stays clean.
const CampaignStrip = ({ className = '' }) => {
  const { campaign, isActive } = useCampaign();

  if (!isActive || !campaign?.bannerImage) return null;

  const desktopUrl = campaign.bannerImage;
  const mobileUrl = campaign.mobileBannerImage || campaign.bannerImage;
  const saleLink = campaign.couponCode
    ? `${ROUTES.CART}?coupon=${campaign.couponCode}`
    : ROUTES.SHOP;

  return (
    <Link
      to={saleLink}
      aria-label={`${campaign.name} — shop the sale`}
      className={`group relative block overflow-hidden rounded-lg bg-enugu-black ${className}`}
    >
      <picture>
        <source media="(max-width: 639px)" srcSet={mobileUrl} />
        <img
          src={desktopUrl}
          alt={campaign.name}
          loading="lazy"
          decoding="async"
          className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-36 md:h-44"
        />
      </picture>

      {campaign.couponCode && (
        <span className="absolute right-3 top-3 rounded-full bg-enugu-gold px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-enugu-black">
          {campaign.couponCode}
        </span>
      )}
    </Link>
  );
};

export default CampaignStrip;
