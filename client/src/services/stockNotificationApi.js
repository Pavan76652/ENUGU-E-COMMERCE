import api from './api';

const unwrap = (response) => {
  const body = response.data;
  return {
    ...(body?.data ?? body),
    message: body?.message,
  };
};

export const stockNotificationApi = {
  subscribe: ({ productId, email, size = null }) =>
    api.post('/stock-notifications', { productId, email, size }).then(unwrap),
};

export default stockNotificationApi;
