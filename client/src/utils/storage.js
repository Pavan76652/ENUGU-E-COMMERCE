export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'enugu_access_token',
  CART_SESSION: 'enugu_cart_session',
};

export const getStorageItem = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeStorageItem = (key) => {
  localStorage.removeItem(key);
};

export default STORAGE_KEYS;
