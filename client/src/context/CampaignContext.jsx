import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { campaignApi } from '../services/campaignApi';

const CampaignContext = createContext({
  campaign: null,
  loading: true,
  isActive: false,
});

const isCampaignLive = (campaign) => {
  if (!campaign) return false;
  const now = Date.now();
  const start = new Date(campaign.startDate).getTime();
  const end = new Date(campaign.endDate).getTime();
  return start <= now && end >= now;
};

export const CampaignProvider = ({ children }) => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    campaignApi
      .getActive()
      .then((result) => {
        const active = result.campaign ?? result;
        if (active && isCampaignLive(active)) {
          setCampaign(active);
        } else {
          setCampaign(null);
        }
      })
      .catch(() => setCampaign(null))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      campaign,
      loading,
      isActive: Boolean(campaign) && isCampaignLive(campaign),
    }),
    [campaign, loading]
  );

  return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>;
};

export const useCampaign = () => useContext(CampaignContext);

export default CampaignContext;
