import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCampaign } from '../../context/CampaignContext';
import { HERO } from '../../constants/homeData';
import { ROUTES } from '../../config/routes';
import BrandLogo from '../common/BrandLogo';
import Animate from '../home/Animate';
const HeroBanner = () => {
  const { campaign, isActive } = useCampaign();
  const [imageFailed, setImageFailed] = useState(false);

  const hero = isActive && campaign
    ? {
        eyebrow: campaign.name,
        title: campaign.greetingMessage.split('—')[0].trim().slice(0, 60) || campaign.name,
        subtitle: campaign.greetingMessage,
        image: campaign.bannerImage || HERO.image,
        ctaPrimary: { label: 'Shop Sale', to: `${ROUTES.CART}?coupon=${campaign.couponCode}` },
        ctaSecondary: { label: 'View Collection', to: ROUTES.SHOP },
      }
    : HERO;

  useEffect(() => {
    setImageFailed(false);
  }, [hero.image]);

  return (
    <section className="relative min-h-[72vh] overflow-hidden bg-enugu-black text-enugu-white sm:min-h-[82vh] lg:min-h-[90vh]">
      <div className="absolute inset-0">
        {!imageFailed && hero.image ? (
          <img
            src={hero.image}
            alt={isActive ? campaign?.name ?? '' : ''}
            className="h-full w-full object-cover object-center opacity-60"
            fetchPriority="high"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-enugu-black via-enugu-black/50 to-enugu-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-enugu-black/80 via-transparent to-transparent" />
      </div>

      {isActive && campaign?.couponCode && (
        <div className="absolute right-4 top-24 z-10 rounded-full bg-enugu-gold px-4 py-2 text-xs font-bold uppercase tracking-widest text-enugu-black sm:right-8">
          {campaign.couponCode}
        </div>
      )}

      <div className="enugu-container relative flex min-h-[72vh] flex-col justify-end pb-10 pt-20 sm:min-h-[82vh] sm:pb-14 sm:pt-28 lg:min-h-[90vh] lg:pb-16 lg:pt-32">
        <Animate>
          <BrandLogo
            link={false}
            height={56}
            className="mb-6 sm:mb-8"
            imgClassName="h-12 w-auto sm:h-14 md:h-16 brightness-0 invert"
          />
        </Animate>

        <Animate>
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-enugu-gold sm:text-xs sm:tracking-[0.4em]">
            {hero.eyebrow}
          </p>
        </Animate>

        <Animate delay={100}>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold uppercase leading-[0.95] tracking-wide sm:text-5xl md:text-6xl lg:text-7xl">
            {isActive ? campaign.name : hero.title}
          </h1>
        </Animate>

        <Animate delay={200}>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-gray-300 sm:text-base">
            {isActive ? campaign.greetingMessage : hero.subtitle}
          </p>
        </Animate>

        <Animate delay={300}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              to={hero.ctaPrimary.to}
              className="enugu-btn-primary w-full bg-enugu-white text-enugu-black hover:bg-enugu-gold sm:w-auto"
            >
              {hero.ctaPrimary.label}
            </Link>
            <Link
              to={hero.ctaSecondary.to}
              className="enugu-btn-outline w-full border-enugu-white text-enugu-white hover:bg-enugu-white hover:text-enugu-black sm:w-auto"
            >
              {hero.ctaSecondary.label}
            </Link>
          </div>
        </Animate>

        <div className="absolute bottom-8 right-4 hidden animate-bounce-slow flex-col items-center gap-2 sm:right-8 md:flex">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 [writing-mode:vertical-lr]">
            Scroll
          </span>
          <div className="h-12 w-px bg-gradient-to-b from-enugu-gold to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
