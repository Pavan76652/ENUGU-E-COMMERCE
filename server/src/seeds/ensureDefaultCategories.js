import Category from '../models/Category.js';
import logger from '../config/logger.js';

export const DEFAULT_CATEGORIES = [
  { name: 'Graphic Tees', slug: 'graphic-tees', sortOrder: 1 },
  { name: 'Oversized Tees', slug: 'oversized-tees', sortOrder: 2 },
  { name: 'Custom Prints', slug: 'custom-prints', sortOrder: 3 },
];

/**
 * Ensures default product categories exist on any database (Atlas, local, etc.).
 * Only inserts when the collection is empty — never overwrites existing categories.
 */
export const ensureDefaultCategories = async () => {
  const count = await Category.countDocuments();
  if (count > 0) return count;

  await Category.insertMany(DEFAULT_CATEGORIES);
  logger.info(`Default categories seeded: ${DEFAULT_CATEGORIES.length}`);
  return DEFAULT_CATEGORIES.length;
};

export default { ensureDefaultCategories, DEFAULT_CATEGORIES };
