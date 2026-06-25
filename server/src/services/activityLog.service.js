import ActivityLog from '../models/ActivityLog.js';
import { getPagination, buildPaginationMeta, parseSort } from '../utils/pagination.js';

export const logActivity = async ({
  actor,
  action,
  resource,
  resourceId = null,
  metadata = {},
  req = null,
}) => {
  try {
    await ActivityLog.create({
      actorId: actor.id,
      actorRole: actor.role,
      actorEmail: actor.email,
      action,
      resource,
      resourceId,
      metadata,
      ipAddress: req?.ip || req?.headers?.['x-forwarded-for'] || null,
    });
  } catch (error) {
    console.error('Activity log failed:', error.message);
  }
};

export const getActivityLogs = async (query = {}) => {
  const { page, limit, skip } = getPagination(query);

  const filter = {};

  if (query.action) filter.action = query.action;
  if (query.resource) filter.resource = query.resource;
  if (query.actorId) filter.actorId = query.actorId;

  if (query.search) {
    const term = query.search.trim();
    filter.$or = [
      { actorEmail: { $regex: term, $options: 'i' } },
      { action: { $regex: term, $options: 'i' } },
    ];
  }

  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }

  const sort = parseSort(query.sortBy || 'createdAt', query.sortOrder || 'desc');

  const [logs, total] = await Promise.all([
    ActivityLog.find(filter)
      .populate('actorId', 'firstName lastName email role')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    ActivityLog.countDocuments(filter),
  ]);

  return { logs, meta: buildPaginationMeta(total, page, limit) };
};

export default { logActivity, getActivityLogs };
