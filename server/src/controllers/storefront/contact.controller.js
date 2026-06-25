import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as contactService from '../../services/contact.service.js';

export const submitContact = asyncHandler(async (req, res) => {
  const message = await contactService.submitContactMessage(req.body, req.user?.id);

  res.status(201).json(
    new ApiResponse(201, { message }, 'Thank you — we received your message and will respond soon')
  );
});
