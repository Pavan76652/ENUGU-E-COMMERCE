import User from '../models/User.js';
import { ROLES } from '../constants/roles.js';
import env from '../config/env.js';
import logger from '../config/logger.js';

/**
 * Ensures a super admin account exists on the connected database.
 *
 * Unlike bootstrapDevData (which only runs against the in-memory dev DB), this
 * runs in every environment so the admin panel is usable immediately after the
 * API is deployed against a real database (MongoDB Atlas, etc.). It only ever
 * creates the account when it is missing and never overwrites an existing one.
 */
export const ensureSuperAdmin = async () => {
  const email = env.superAdmin.email;
  const password = env.superAdmin.password;

  if (!email || !password) {
    logger.warn('Super admin bootstrap skipped — SUPER_ADMIN_EMAIL/PASSWORD not set');
    return null;
  }

  const existing = await User.findByEmail(email);
  if (existing) {
    if (existing.role !== ROLES.SUPER_ADMIN) {
      logger.error(`User ${email} exists but is not a super admin — skipping bootstrap`);
      return null;
    }
    return existing;
  }

  try {
    const superAdmin = await User.create({
      firstName: env.superAdmin.firstName,
      lastName: env.superAdmin.lastName,
      email,
      password,
      role: ROLES.SUPER_ADMIN,
      isEmailVerified: true,
      isActive: true,
    });

    logger.info(`Super admin created: ${email}`);
    return superAdmin;
  } catch (error) {
    // Another process may have created the account first (e.g. nodemon double-start).
    if (error?.code === 11_000) {
      const raced = await User.findByEmail(email);
      if (raced) return raced;
    }
    throw error;
  }
};

export default { ensureSuperAdmin };
