export const FESTIVAL_TYPES = Object.freeze({
  INDEPENDENCE_DAY: 'independence_day',
  DASARA: 'dasara',
  DIWALI: 'diwali',
  NEW_YEAR: 'new_year',
  CUSTOM: 'custom',
});

export const ALL_FESTIVAL_TYPES = Object.freeze(Object.values(FESTIVAL_TYPES));

export const FESTIVAL_TYPE_LABELS = Object.freeze({
  [FESTIVAL_TYPES.INDEPENDENCE_DAY]: 'Independence Day Sale',
  [FESTIVAL_TYPES.DASARA]: 'Dasara Sale',
  [FESTIVAL_TYPES.DIWALI]: 'Diwali Sale',
  [FESTIVAL_TYPES.NEW_YEAR]: 'New Year Sale',
  [FESTIVAL_TYPES.CUSTOM]: 'Custom Campaign',
});

export const FESTIVAL_PRESETS = Object.freeze({
  [FESTIVAL_TYPES.INDEPENDENCE_DAY]: {
    name: 'Independence Day Sale',
    greetingMessage: 'Celebrate freedom in style — exclusive Independence Day offers on premium streetwear.',
    couponCode: 'FREEDOM15',
  },
  [FESTIVAL_TYPES.DASARA]: {
    name: 'Dasara Sale',
    greetingMessage: 'Victory looks good on you. Unlock festive savings this Dasara.',
    couponCode: 'DASARA20',
  },
  [FESTIVAL_TYPES.DIWALI]: {
    name: 'Diwali Sale',
    greetingMessage: 'Light up your wardrobe this Diwali — limited-time festive discounts await.',
    couponCode: 'DIWALI25',
  },
  [FESTIVAL_TYPES.NEW_YEAR]: {
    name: 'New Year Sale',
    greetingMessage: 'New year, new identity. Start fresh with exclusive New Year deals.',
    couponCode: 'NEWYEAR30',
  },
});

export default FESTIVAL_TYPES;
