import CustomDesignRequest from '../models/CustomDesignRequest.js';
import ApiError from '../utils/ApiError.js';
import { getPagination, buildPaginationMeta, parseSort } from '../utils/pagination.js';
import { AUDIT_ACTIONS, AUDIT_RESOURCES } from '../constants/auditActions.js';
import { DESIGN_REQUEST_STATUS } from '../constants/designRequestStatus.js';
import { logActivity } from './activityLog.service.js';
import { uploadDesignReference } from './cloudinary.service.js';
import { isCloudinaryConfigured } from '../config/cloudinary.js';

export const createDesignRequest = async (data, file, userId = null) => {
  const referenceImages = [];

  if (file) {
    if (!isCloudinaryConfigured()) {
      throw new ApiError(
        503,
        'Image upload is temporarily unavailable. Submit without image or try again later.'
      );
    }

    const uploaded = await uploadDesignReference(file.buffer);
    referenceImages.push(uploaded);
  }

  const request = await CustomDesignRequest.create({
    userId: userId ?? undefined,
    customerName: data.customerName,
    email: data.email,
    phone: data.phone,
    designBrief: data.designDescription,
    quantity: data.quantity,
    referenceImages,
    status: DESIGN_REQUEST_STATUS.NEW,
  });

  return request;
};

export const listDesignRequests = async (query = {}) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.assignedTo) filter.assignedTo = query.assignedTo;

  if (query.search) {
    filter.$or = [
      { customerName: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
      { phone: { $regex: query.search, $options: 'i' } },
    ];
  }

  const sort = parseSort(query.sortBy || 'createdAt', query.sortOrder || 'desc');

  const [requests, total] = await Promise.all([
    CustomDesignRequest.find(filter)
      .populate('userId', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    CustomDesignRequest.countDocuments(filter),
  ]);

  return { requests, meta: buildPaginationMeta(total, page, limit) };
};

export const getDesignRequestById = async (id) => {
  const request = await CustomDesignRequest.findById(id)
    .populate('userId', 'firstName lastName email phone')
    .populate('assignedTo', 'firstName lastName email');

  if (!request) {
    throw new ApiError(404, 'Design request not found');
  }

  return request;
};

export const updateDesignRequest = async (id, data, actor, req) => {
  const request = await CustomDesignRequest.findById(id);

  if (!request) {
    throw new ApiError(404, 'Design request not found');
  }

  if (data.status) request.status = data.status;
  if (data.adminNotes !== undefined) request.adminNotes = data.adminNotes;
  if (data.assignedTo !== undefined) request.assignedTo = data.assignedTo || null;

  if (data.quotedPrice !== undefined) {
    request.quotedPrice = data.quotedPrice;
    request.quotedAt = new Date();
    if (!data.status) request.status = DESIGN_REQUEST_STATUS.QUOTATION_SENT;
  }

  if (data.status === DESIGN_REQUEST_STATUS.COMPLETED) {
    request.completedAt = new Date();
  }

  await request.save();

  await logActivity({
    actor,
    action: AUDIT_ACTIONS.DESIGN_REQUEST_UPDATED,
    resource: AUDIT_RESOURCES.DESIGN_REQUEST,
    resourceId: request._id,
    metadata: { status: request.status, assignedTo: request.assignedTo },
    req,
  });

  return request;
};

export default {
  createDesignRequest,
  listDesignRequests,
  getDesignRequestById,
  updateDesignRequest,
};
