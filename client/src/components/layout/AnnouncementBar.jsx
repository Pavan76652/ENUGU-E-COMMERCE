import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCampaign } from '../../context/CampaignContext';
import { ANNOUNCEMENT } from '../../constants/homeData';
import { ROUTES } from '../../config/routes';

const AnnouncementBar = () => {
  const { campaign, isActive } = useCampaign();

  if (isActive && campaign) {
    return (
      <div className="bg-enugu-gold text-enugu-black">
        <div className="enugu-container flex items-center justify-center gap-2 py-2.5 text-center text-xs sm:text-sm">
          <span className="font-medium tracking-wide">{campaign.greetingMessage}</span>
          <span className="hidden sm:inline">—</span>
          <Link
            to={`${ROUTES.CART}?coupon=${campaign.couponCode}`}
            className="font-semibold uppercase tracking-widest underline-offset-2 transition hover:underline"
          >
            Use {campaign.couponCode}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-enugu-black text-enugu-white">
      <div className="enugu-container flex items-center justify-center gap-2 py-2.5 text-center text-xs sm:text-sm">
        <span className="tracking-wide">{ANNOUNCEMENT.text}</span>
        <span className="hidden text-enugu-gold sm:inline">—</span>
        <Link
          to={ANNOUNCEMENT.link}
          className="font-medium uppercase tracking-widest text-enugu-gold transition hover:text-enugu-white"
        >
          {ANNOUNCEMENT.linkLabel}
        </Link>
      </div>
    </div>
  );
};

export default AnnouncementBar;
