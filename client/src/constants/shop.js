export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

export const AVAILABILITY_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'in_stock', label: 'In Stock' },
  { value: 'sold_out', label: 'Sold Out' },
];

export const PRICE_RANGES = [
  { label: 'All Prices', min: null, max: null },
  { label: 'Under ₹999', min: null, max: 999 },
  { label: '₹999 – ₹1,199', min: 999, max: 1199 },
  { label: '₹1,200+', min: 1200, max: null },
];

export default SORT_OPTIONS;
