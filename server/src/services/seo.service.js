import Product from '../models/Product.js';
import env from '../config/env.js';
import { PRODUCT_STATUS } from '../constants/productStatus.js';
import { STATIC_SEO_PAGES } from '../utils/seoHelpers.js';

const STOREFRONT_STATUSES = [PRODUCT_STATUS.PUBLISHED, PRODUCT_STATUS.SOLD_OUT];

export const buildSitemapXml = async () => {
  const products = await Product.find({ status: { $in: STOREFRONT_STATUSES } })
    .select('slug updatedAt')
    .sort({ updatedAt: -1 })
    .lean();

  const baseUrl = env.clientUrl.replace(/\/$/, '');
  const now = new Date().toISOString();

  const urls = [
    ...STATIC_SEO_PAGES.map((page) => ({
      loc: `${baseUrl}${page.path}`,
      lastmod: now,
      changefreq: page.changefreq,
      priority: page.priority,
    })),
    ...products.map((product) => ({
      loc: `${baseUrl}/product/${product.slug}`,
      lastmod: (product.updatedAt ?? new Date()).toISOString(),
      changefreq: 'weekly',
      priority: '0.8',
    })),
  ];

  const body = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
};

export const buildRobotsTxt = () => {
  const baseUrl = env.clientUrl.replace(/\/$/, '');
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/api/v1/seo/sitemap.xml
`;
};

export default { buildSitemapXml, buildRobotsTxt };
