export const FESTIVAL_TYPES = {
  INDEPENDENCE_DAY: 'independence_day',
  DASARA: 'dasara',
  DIWALI: 'diwali',
  NEW_YEAR: 'new_year',
  CUSTOM: 'custom',
};

export const FESTIVAL_TYPE_OPTIONS = [
  { value: FESTIVAL_TYPES.INDEPENDENCE_DAY, label: 'Independence Day Sale' },
  { value: FESTIVAL_TYPES.DASARA, label: 'Dasara Sale' },
  { value: FESTIVAL_TYPES.DIWALI, label: 'Diwali Sale' },
  { value: FESTIVAL_TYPES.NEW_YEAR, label: 'New Year Sale' },
  { value: FESTIVAL_TYPES.CUSTOM, label: 'Custom Campaign' },
];

export const FESTIVAL_TYPE_LABELS = {
  [FESTIVAL_TYPES.INDEPENDENCE_DAY]: 'Independence Day Sale',
  [FESTIVAL_TYPES.DASARA]: 'Dasara Sale',
  [FESTIVAL_TYPES.DIWALI]: 'Diwali Sale',
  [FESTIVAL_TYPES.NEW_YEAR]: 'New Year Sale',
  [FESTIVAL_TYPES.CUSTOM]: 'Custom',
};

export const FESTIVAL_PRESETS = {
  [FESTIVAL_TYPES.INDEPENDENCE_DAY]: {
    name: 'Independence Day Sale',
    greetingMessage: 'Celebrate freedom in style — exclusive Independence Day offers on premium streetwear.',
    couponCode: 'FREEDOM15',
    bannerImage:
      'https://images.unsplash.com/photo-1564507592333-c60657eea527?auto=format&fit=crop&w=1600&q=80',
  },
  [FESTIVAL_TYPES.DASARA]: {
    name: 'Dasara Sale',
    greetingMessage: 'Victory looks good on you. Unlock festive savings this Dasara.',
    couponCode: 'DASARA20',
    bannerImage:
      'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=1600&q=80',
  },
  [FESTIVAL_TYPES.DIWALI]: {
    name: 'Diwali Sale',
    greetingMessage: 'Light up your wardrobe this Diwali — limited-time festive discounts await.',
    couponCode: 'DIWALI25',
    bannerImage:
      'https://images.unsplash.com/photo-1605810230434-7637ac6a3584?auto=format&fit=crop&w=1600&q=80',
  },
  [FESTIVAL_TYPES.NEW_YEAR]: {
    name: 'New Year Sale',
    greetingMessage: 'New year, new identity. Start fresh with exclusive New Year deals.',
    couponCode: 'NEWYEAR30',
    bannerImage:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80',
  },
};

export default FESTIVAL_TYPES;
