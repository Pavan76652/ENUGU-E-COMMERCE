import { SORT_OPTIONS } from '../../constants/shop';

const ShopSort = ({ value, onChange, count }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <p className="text-sm text-gray-500">
      <span className="font-medium text-enugu-black">{count}</span> products
    </p>
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-xs uppercase tracking-wider text-gray-400">
        Sort by
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-enugu-gold"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default ShopSort;
