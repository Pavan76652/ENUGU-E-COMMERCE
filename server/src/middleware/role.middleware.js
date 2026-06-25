import ApiError from '../utils/ApiError.js';
import { ADMIN_ROLES, ROLES, hasMinimumRole } from '../constants/roles.js';
import { hasAnyPermission } from '../constants/permissions.js';

export const authorize =
  (...allowedRoles) =>
  (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, 'You do not have permission to perform this action')
      );
    }

    next();
  };

export const authorizeMinimumRole = (minimumRole) => (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required'));
  }

  if (!hasMinimumRole(req.user.role, minimumRole)) {
    return next(
      new ApiError(403, 'You do not have permission to perform this action')
    );
  }

  next();
};

export const authorizePermission =
  (...requiredPermissions) =>
  (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (req.user.role === ROLES.SUPER_ADMIN) {
      return next();
    }

    if (!hasAnyPermission(req.user.permissions, requiredPermissions)) {
      return next(
        new ApiError(403, 'You do not have permission to perform this action')
      );
    }

    next();
  };

export const isAdmin = authorize(...ADMIN_ROLES);
export const isSuperAdmin = authorize(ROLES.SUPER_ADMIN);

export default authorize;
