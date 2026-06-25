import { PRODUCT_SIZES } from '../../constants/product';
import { AVAILABILITY_OPTIONS, PRICE_RANGES } from '../../constants/shop';

const FilterSection = ({ title, children }) => (
  <div className="border-b border-gray-100 py-5">
    <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-enugu-black">{title}</h3>
    {children}
  </div>
);

const ShopFilters = ({ filters, categories, onChange, onReset }) => (
  <div className="space-y-0">
    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
      <h2 className="text-sm font-medium uppercase tracking-widest">Filters</h2>
      <button
        type="button"
        onClick={onReset}
        className="text-xs uppercase tracking-wider text-gray-400 transition hover:text-enugu-gold"
      >
        Reset
      </button>
    </div>

    <FilterSection title="Category">
      <div className="space-y-2">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="radio"
            name="category"
            checked={!filters.category}
            onChange={() => onChange({ category: '' })}
            className="accent-enugu-gold"
          />
          All Categories
        </label>
        {categories.map((cat) => {
          const catId = String(cat._id ?? cat.id);
          return (
          <label key={catId} className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="category"
              checked={filters.category === catId}
              onChange={() => onChange({ category: catId })}
              className="accent-enugu-gold"
            />
            {cat.name}
          </label>
          );
        })}      </div>
    </FilterSection>

    <FilterSection title="Price">
      <div className="space-y-2">
        {PRICE_RANGES.map((range) => (
          <label key={range.label} className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="price"
              checked={filters.minPrice === range.min && filters.maxPrice === range.max}
              onChange={() => onChange({ minPrice: range.min, maxPrice: range.max })}
              className="accent-enugu-gold"
            />
            {range.label}
          </label>
        ))}
      </div>
    </FilterSection>

    <FilterSection title="Size">
      <div className="flex flex-wrap gap-2">
        {PRODUCT_SIZES.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onChange({ size: filters.size === size ? '' : size })}
            className={`min-w-[2.5rem] border px-3 py-1.5 text-xs font-medium uppercase transition ${
              filters.size === size
                ? 'border-enugu-black bg-enugu-black text-enugu-white'
                : 'border-gray-200 hover:border-enugu-black'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </FilterSection>

    <FilterSection title="Availability">
      <div className="space-y-2">
        {AVAILABILITY_OPTIONS.map((opt) => (
          <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="availability"
              checked={filters.availability === opt.value}
              onChange={() => onChange({ availability: opt.value })}
              className="accent-enugu-gold"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </FilterSection>
  </div>
);

export default ShopFilters;
