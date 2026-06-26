// Sanitize the API base URL so a malformed env value (stray spaces, an
// accidentally duplicated URL, or a trailing slash pasted in the host
// dashboard) can never produce broken request paths like
// "/api/v1%20https://.../api/v1/...".
const sanitizeApiBaseUrl = (raw) => {
  const fallback = 'http://localhost:5000/api/v1';
  if (!raw || typeof raw !== 'string') return fallback;

  // Take the first whitespace-separated token (drops a duplicated paste),
  // then strip any trailing slashes.
  const first = raw.trim().split(/\s+/)[0] ?? '';
  const cleaned = first.replace(/\/+$/, '');
  return cleaned || fallback;
};

export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'ENUGU',
  tagline: import.meta.env.VITE_APP_TAGLINE || 'Wear Your Identity',
  apiBaseUrl: sanitizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
  cloudinaryCloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  freeShippingThreshold: Number(import.meta.env.VITE_FREE_SHIPPING_THRESHOLD) || 999,
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'goudarjun763@gmail.com',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '917989528173',
  supportPhone: import.meta.env.VITE_SUPPORT_PHONE || import.meta.env.VITE_WHATSAPP_NUMBER || '917989528173',
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || '',
  siteUrl: import.meta.env.VITE_SITE_URL || '',
};

export default env;
