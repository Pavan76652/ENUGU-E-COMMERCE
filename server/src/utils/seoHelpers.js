import env from '../config/env.js';

const SITE_NAME = 'ENUGU';
const DEFAULT_SUFFIX = `| ${SITE_NAME}`;

export const truncate = (text = '', max = 160) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 3).trim()}...`;
};

export const stripHtml = (text = '') => text.replace(/<[^>]*>/g, '');

export const getCoverImageUrl = (product) => {
  const images = product.images ?? [];
  const cover = images.find((img) => img.isCover) ?? images[0];
  return cover?.url ?? null;
};

export const buildProductSeo = (product) => {
  const slug = product.slug;
  const name = product.name;
  const brand = product.brand || SITE_NAME;
  const category = product.categoryId?.name;

  const title = product.metaTitle?.trim()
    || truncate(`${name} — Premium Streetwear ${DEFAULT_SUFFIX}`, 70);

  const fallbackDescription = [
    `Shop ${name} at ${SITE_NAME}.`,
    category ? `${category} collection.` : '',
    `Premium printed streetwear from ₹${product.sellingPrice ?? ''}.`,
    `Free shipping on orders above ₹${env.store.freeShippingThreshold}.`,
  ]
    .filter(Boolean)
    .join(' ');

  const description = product.metaDescription?.trim()
    || truncate(stripHtml(product.description) || fallbackDescription, 160);

  const path = `/product/${slug}`;
  const image = getCoverImageUrl(product);

  return {
    slug,
    title,
    description,
    path,
    canonicalUrl: `${env.clientUrl}${path}`,
    image,
    keywords: [name, brand, category, 'streetwear', 't-shirts', SITE_NAME]
      .filter(Boolean)
      .join(', '),
    openGraph: {
      type: 'product',
      title,
      description,
      url: `${env.clientUrl}${path}`,
      image,
      siteName: SITE_NAME,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name,
      description,
      sku: product.sku,
      image: image ? [image] : undefined,
      brand: { '@type': 'Brand', name: brand },
      offers: {
        '@type': 'Offer',
        url: `${env.clientUrl}${path}`,
        priceCurrency: env.store.currency || 'INR',
        price: product.sellingPrice,
        availability: product.inventory?.isSoldOut
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      },
    },
  };
};

export const STATIC_SEO_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/shop', priority: '0.9', changefreq: 'daily' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/custom-design', priority: '0.7', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.4', changefreq: 'yearly' },
  { path: '/terms-and-conditions', priority: '0.4', changefreq: 'yearly' },
  { path: '/refund-policy', priority: '0.4', changefreq: 'yearly' },
  { path: '/shipping-policy', priority: '0.5', changefreq: 'yearly' },
  { path: '/return-policy', priority: '0.5', changefreq: 'yearly' },
];

export default {
  truncate,
  stripHtml,
  buildProductSeo,
  STATIC_SEO_PAGES,
};
