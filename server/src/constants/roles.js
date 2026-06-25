export const ROLES = Object.freeze({
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
});

export const ROLE_HIERARCHY = Object.freeze({
  [ROLES.CUSTOMER]: 0,
  [ROLES.ADMIN]: 1,
  [ROLES.SUPER_ADMIN]: 2,
});

export const ALL_ROLES = Object.freeze(Object.values(ROLES));

export const ADMIN_ROLES = Object.freeze([ROLES.ADMIN, ROLES.SUPER_ADMIN]);

export const isValidRole = (role) => ALL_ROLES.includes(role);

export const hasMinimumRole = (userRole, requiredRole) => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};
