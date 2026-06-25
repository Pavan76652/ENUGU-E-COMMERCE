import asyncHandler from '../../utils/asyncHandler.js';
import * as seoService from '../../services/seo.service.js';

export const getSitemap = asyncHandler(async (_req, res) => {
  const xml = await seoService.buildSitemapXml();
  res.set('Content-Type', 'application/xml');
  res.status(200).send(xml);
});

export const getRobots = asyncHandler(async (_req, res) => {
  const text = seoService.buildRobotsTxt();
  res.set('Content-Type', 'text/plain');
  res.status(200).send(text);
});
