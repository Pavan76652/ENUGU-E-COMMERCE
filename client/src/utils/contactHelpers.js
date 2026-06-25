import env from '../config/env';

export const digitsOnly = (value = '') => value.replace(/\D/g, '');

export const formatDisplayPhone = (number = env.supportPhone) => {
  const digits = digitsOnly(number);

  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  return number;
};

export const formatTelLink = (number = env.supportPhone) => {
  const digits = digitsOnly(number);
  if (!digits) return '';
  return digits.startsWith('91') ? `tel:+${digits}` : `tel:+91${digits}`;
};

export const getWhatsAppUrl = (
  message = 'Hi ENUGU, I would like to get in touch.',
  number = env.whatsappNumber
) => {
  const digits = digitsOnly(number);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
};

export const getInstagramHandle = (url = env.instagramUrl) => {
  if (!url) return '@enuguofficial';
  const match = url.match(/instagram\.com\/([^/?]+)/i);
  return match ? `@${match[1]}` : '@enuguofficial';
};

export default {
  digitsOnly,
  formatDisplayPhone,
  formatTelLink,
  getWhatsAppUrl,
  getInstagramHandle,
};
