export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'ENUGU',
  tagline: import.meta.env.VITE_APP_TAGLINE || 'Wear Your Identity',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
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
