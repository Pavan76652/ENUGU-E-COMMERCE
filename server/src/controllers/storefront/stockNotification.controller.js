import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as stockNotificationService from '../../services/stockNotification.service.js';

export const subscribe = asyncHandler(async (req, res) => {
  const result = await stockNotificationService.subscribeToStockNotification({
    ...req.body,
    userId: req.user?.id,
  });

  const message = result.alreadySubscribed
    ? 'You are already subscribed for this notification'
    : 'You will be notified when this item is back in stock';

  res.status(result.alreadySubscribed ? 200 : 201).json(
    new ApiResponse(
      result.alreadySubscribed ? 200 : 201,
      { subscription: result.subscription },
      message
    )
  );
});
