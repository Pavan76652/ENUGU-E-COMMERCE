export const DESIGN_REQUEST_STATUS = Object.freeze({
  NEW: 'new',
  CONTACTED: 'contacted',
  QUOTATION_SENT: 'quotation_sent',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
});

export const ALL_DESIGN_REQUEST_STATUSES = Object.freeze(
  Object.values(DESIGN_REQUEST_STATUS)
);

export const DESIGN_REQUEST_STATUS_LABELS = Object.freeze({
  [DESIGN_REQUEST_STATUS.NEW]: 'New',
  [DESIGN_REQUEST_STATUS.CONTACTED]: 'Contacted',
  [DESIGN_REQUEST_STATUS.QUOTATION_SENT]: 'Quotation Sent',
  [DESIGN_REQUEST_STATUS.CONFIRMED]: 'Confirmed',
  [DESIGN_REQUEST_STATUS.COMPLETED]: 'Completed',
});

export default DESIGN_REQUEST_STATUS;
