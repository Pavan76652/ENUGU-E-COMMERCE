import { Link } from 'react-router-dom';
import env from '../../config/env';
import BRAND from '../../constants/brand';
import { ROUTES } from '../../config/routes';
import { formatDisplayPhone, formatTelLink, getInstagramHandle } from '../../utils/contactHelpers';

const FOOTER_LINKS = {
  shop: [
    { label: 'All Products', to: ROUTES.SHOP },
    { label: 'Collections', to: ROUTES.COLLECTIONS },
    { label: 'New Arrivals', to: `${ROUTES.SHOP}?sort=new` },
    { label: 'Custom Design', to: ROUTES.CUSTOM_DESIGN },
  ],
  help: [
    { label: 'Contact', to: ROUTES.CONTACT },
    { label: 'About', to: ROUTES.ABOUT },
    { label: 'Shipping Policy', to: ROUTES.SHIPPING_POLICY },
    { label: 'Return Policy', to: ROUTES.RETURN_POLICY },
  ],
  legal: [
    { label: 'Privacy Policy', to: ROUTES.PRIVACY_POLICY },
    { label: 'Terms & Conditions', to: ROUTES.TERMS },
    { label: 'Refund Policy', to: ROUTES.REFUND_POLICY },
  ],
};

const Footer = () => (
  <footer className="bg-enugu-black text-enugu-white">
    <div className="enugu-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
      <div className="sm:col-span-2 lg:col-span-1">
        <Link to={ROUTES.HOME} className="font-display text-2xl font-bold tracking-[0.3em]">
          {BRAND.name}
        </Link>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">
          {BRAND.tagline}. Premium printed streetwear for the bold.
        </p>
        <p className="mt-4 text-xs uppercase tracking-widest text-enugu-gold">
          Free shipping above ₹{env.freeShippingThreshold}
        </p>
      </div>

      <div>
        <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-enugu-gold">Shop</h4>
        <ul className="mt-4 space-y-2.5">
          {FOOTER_LINKS.shop.map((link) => (
            <li key={link.label}>
              <Link to={link.to} className="text-sm text-gray-400 transition hover:text-enugu-white">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-enugu-gold">Help</h4>
        <ul className="mt-4 space-y-2.5">
          {FOOTER_LINKS.help.map((link) => (
            <li key={link.label}>
              <Link to={link.to} className="text-sm text-gray-400 transition hover:text-enugu-white">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-enugu-gold">Legal</h4>
        <ul className="mt-4 space-y-2.5">
          {FOOTER_LINKS.legal.map((link) => (
            <li key={link.label}>
              <Link to={link.to} className="text-sm text-gray-400 transition hover:text-enugu-white">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-enugu-gold">Connect</h4>
        <div className="mt-4 space-y-2.5 text-sm text-gray-400">
          <a href={formatTelLink(env.supportPhone)} className="block transition hover:text-enugu-white">
            {formatDisplayPhone(env.supportPhone)}
          </a>
          <a href={`mailto:${env.supportEmail}`} className="block transition hover:text-enugu-white">
            {env.supportEmail}
          </a>
          <a
            href={env.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="block transition hover:text-enugu-white"
          >
            {getInstagramHandle()}
          </a>
          <a
            href={`https://wa.me/${env.whatsappNumber?.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="block transition hover:text-enugu-white"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="enugu-container flex flex-col items-center justify-between gap-4 py-5 text-xs text-gray-500 sm:flex-row">
        <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <Link to={ROUTES.PRIVACY_POLICY} className="hover:text-enugu-white">Privacy</Link>
          <Link to={ROUTES.TERMS} className="hover:text-enugu-white">Terms</Link>
          <Link to={ROUTES.REFUND_POLICY} className="hover:text-enugu-white">Refunds</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
