export const DESIGN_REQUEST_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUOTATION_SENT: 'quotation_sent',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
};

export const DESIGN_REQUEST_STATUS_OPTIONS = [
  { value: DESIGN_REQUEST_STATUS.NEW, label: 'New' },
  { value: DESIGN_REQUEST_STATUS.CONTACTED, label: 'Contacted' },
  { value: DESIGN_REQUEST_STATUS.QUOTATION_SENT, label: 'Quotation Sent' },
  { value: DESIGN_REQUEST_STATUS.CONFIRMED, label: 'Confirmed' },
  { value: DESIGN_REQUEST_STATUS.COMPLETED, label: 'Completed' },
];

export const DESIGN_REQUEST_STATUS_LABELS = {
  [DESIGN_REQUEST_STATUS.NEW]: 'New',
  [DESIGN_REQUEST_STATUS.CONTACTED]: 'Contacted',
  [DESIGN_REQUEST_STATUS.QUOTATION_SENT]: 'Quotation Sent',
  [DESIGN_REQUEST_STATUS.CONFIRMED]: 'Confirmed',
  [DESIGN_REQUEST_STATUS.COMPLETED]: 'Completed',
};

export default DESIGN_REQUEST_STATUS;
