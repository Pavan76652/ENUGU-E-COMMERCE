import api from './api';

const unwrap = (response) => {
  const body = response.data;
  return {
    ...(body?.data ?? body),
    message: body?.message,
  };
};

export const contactApi = {
  submit: (payload) => api.post('/contact', payload).then(unwrap),
};

export default contactApi;
