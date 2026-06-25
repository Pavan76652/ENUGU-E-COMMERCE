import { Outlet } from 'react-router-dom';
import { CampaignProvider } from '../context/CampaignContext';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { CampaignPopup } from '../components/campaign';
import { WishlistSync } from '../components/wishlist';
import { FloatingWhatsApp } from '../components/contact';

const CustomerLayout = () => (
  <CampaignProvider>
    <div className="flex min-h-screen flex-col">
      <WishlistSync />
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CampaignPopup />
      <FloatingWhatsApp />
    </div>
  </CampaignProvider>
);

export default CustomerLayout;
