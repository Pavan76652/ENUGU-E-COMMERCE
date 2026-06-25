import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { ROLES } from '../constants/roles.js';
import { AUDIT_ACTIONS, AUDIT_RESOURCES } from '../constants/auditActions.js';
import { logActivity } from './activityLog.service.js';
import { getPagination, buildPaginationMeta } from '../utils/pagination.js';

const sanitizeAdmin = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  permissions: user.permissions ?? [],
  isActive: user.isActive,
  lastLoginAt: user.lastLoginAt,
  createdBy: user.createdBy,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const listAdmins = async (query = {}) => {
  const { page, limit, skip } = getPagination(query);

  const filter = { role: ROLES.ADMIN };
  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === 'true';
  }

  const [admins, total] = await Promise.all([
    User.find(filter)
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return {
    admins: admins.map(sanitizeAdmin),
    meta: buildPaginationMeta(total, page, limit),
  };
};

export const createAdmin = async (data, actor, req) => {
  const existing = await User.findByEmail(data.email);

  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const admin = await User.create({
    firstName: data.firstName,
    lastName: data.lastName ?? '',
    email: data.email,
    phone: data.phone,
    password: data.password,
    role: ROLES.ADMIN,
    permissions: data.permissions ?? [],
    isEmailVerified: true,
    isActive: true,
    createdBy: actor.id,
  });

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.ADMIN_CREATED,
    resource: AUDIT_RESOURCES.ADMIN,
    resourceId: admin._id,
    metadata: { email: admin.email, permissions: admin.permissions },
    req,
  });

  return sanitizeAdmin(admin);
};

export const updateAdmin = async (adminId, data, actor, req) => {
  const admin = await User.findOne({ _id: adminId, role: ROLES.ADMIN });

  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }

  if (data.firstName) admin.firstName = data.firstName;
  if (data.lastName !== undefined) admin.lastName = data.lastName;
  if (data.phone !== undefined) admin.phone = data.phone;
  if (data.permissions) admin.permissions = data.permissions;

  await admin.save();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.ADMIN_UPDATED,
    resource: AUDIT_RESOURCES.ADMIN,
    resourceId: admin._id,
    metadata: { permissions: admin.permissions },
    req,
  });

  return sanitizeAdmin(admin);
};

export const setAdminStatus = async (adminId, isActive, actor, req) => {
  const admin = await User.findOne({ _id: adminId, role: ROLES.ADMIN });

  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }

  admin.isActive = isActive;
  if (!isActive) {
    admin.refreshToken = undefined;
  }

  await admin.save({ validateBeforeSave: false });

  await logActivity({
    actor,
    action: isActive ? AUDIT_ACTIONS.ADMIN_ENABLED : AUDIT_ACTIONS.ADMIN_DISABLED,
    resource: AUDIT_RESOURCES.ADMIN,
    resourceId: admin._id,
    metadata: { email: admin.email },
    req,
  });

  return sanitizeAdmin(admin);
};

export default { listAdmins, createAdmin, updateAdmin, setAdminStatus };
