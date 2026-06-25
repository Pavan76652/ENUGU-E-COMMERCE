import env from '../config/env';
import BRAND from '../constants/brand';

const SITE_NAME = env.appName || BRAND.name;
const SITE_URL = (
  import.meta.env.VITE_SITE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173')
).replace(/\/$/, '');
const DEFAULT_DESCRIPTION = `${SITE_NAME} — ${env.tagline}. Premium printed streetwear. Free shipping above ₹${env.freeShippingThreshold}.`;

export const getSiteUrl = () => SITE_URL;

export const buildCanonicalUrl = (path = '/') => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
};

export const buildPageSeo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image,
  noindex = false,
  type = 'website',
}) => {
  const fullTitle = title?.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonical = buildCanonicalUrl(path);

  return {
    title: fullTitle,
    description,
    canonical,
    noindex,
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: canonical,
      image: image || `${SITE_URL}/favicon.ico`,
      siteName: SITE_NAME,
    },
  };
};

export const buildProductSeo = (product, serverSeo) => {
  if (serverSeo) {
    return {
      title: serverSeo.title,
      description: serverSeo.description,
      canonical: serverSeo.canonicalUrl || buildCanonicalUrl(serverSeo.path || `/product/${product.slug}`),
      keywords: serverSeo.keywords,
      openGraph: {
        type: 'product',
        title: serverSeo.openGraph?.title || serverSeo.title,
        description: serverSeo.openGraph?.description || serverSeo.description,
        url: serverSeo.openGraph?.url || serverSeo.canonicalUrl,
        image: serverSeo.openGraph?.image || serverSeo.image,
        siteName: SITE_NAME,
      },
      jsonLd: serverSeo.jsonLd,
      slug: serverSeo.slug || product.slug,
    };
  }

  const path = `/product/${product.slug}`;
  const title = product.metaTitle || `${product.name} | ${SITE_NAME}`;
  const description =
    product.metaDescription ||
    `Shop ${product.name} at ${SITE_NAME}. Premium streetwear from ₹${product.sellingPrice ?? ''}.`;

  return buildPageSeo({
    title,
    description,
    path,
    image: product.image,
    type: 'product',
  });
};

export const PAGE_SEO = {
  home: buildPageSeo({
    title: `${SITE_NAME} — ${env.tagline}`,
    description: DEFAULT_DESCRIPTION,
    path: '/',
  }),
  shop: buildPageSeo({
    title: 'Shop Premium Streetwear',
    description: `Browse ENUGU t-shirts, hoodies, and limited drops. Filter by size, price, and availability. Free shipping above ₹${env.freeShippingThreshold}.`,
    path: '/shop',
  }),
  contact: buildPageSeo({
    title: 'Contact Us',
    description: 'Get in touch with ENUGU for orders, custom designs, and support. WhatsApp, phone, and email available.',
    path: '/contact',
  }),
  customDesign: buildPageSeo({
    title: 'Custom Design',
    description: 'Request a custom printed tee with ENUGU. Share your idea, quantity, and reference images.',
    path: '/custom-design',
  }),
};

export default {
  getSiteUrl,
  buildCanonicalUrl,
  buildPageSeo,
  buildProductSeo,
  PAGE_SEO,
};
