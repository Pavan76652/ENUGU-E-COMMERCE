import { useDebounce } from '../../hooks/useDebounce';

const ShopSearch = ({ value, onChange }) => {
  const debounced = useDebounce(value, 300);

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products..."
        className="w-full border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-enugu-gold"
        aria-label="Search products"
      />
      {debounced !== value && (
        <span className="sr-only">Searching...</span>
      )}
    </div>
  );
};

export default ShopSearch;
