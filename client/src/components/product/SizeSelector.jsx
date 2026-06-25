const SizeSelector = ({ sizes, selected, onSelect, onSizeGuideClick, hasSizeGuide = false }) => (
  <div>
    <div className="flex items-center justify-between">
      <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-enugu-black dark:text-white">
        Select Size
      </h3>
      {hasSizeGuide && (
        <button
          type="button"
          onClick={onSizeGuideClick}
          className="inline-flex items-center gap-1.5 rounded-full border border-enugu-black bg-white px-3.5 py-1.5 text-sm font-semibold text-enugu-black shadow-sm transition-colors hover:bg-enugu-black hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 7.5h18v9H3v-9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7.5v3M11 7.5v4M15 7.5v3M19 7.5v4" />
          </svg>
          Size Guide
        </button>
      )}
    </div>

    <div className="mt-3 flex flex-wrap gap-2">
      {sizes.map((item) => {
        const outOfStock = !item.inStock && item.stock <= 0;
        const isSelected = selected === item.size;

        return (
          <button
            key={item.size}
            type="button"
            onClick={() => onSelect(item.size)}
            className={`relative min-w-[3rem] border px-4 py-2.5 text-sm font-medium uppercase transition ${
              outOfStock
                ? isSelected
                  ? 'border-enugu-gold bg-enugu-gold/10 text-enugu-gold'
                  : 'border-gray-100 text-gray-400 hover:border-enugu-gold/50'
                : isSelected
                  ? 'border-enugu-black bg-enugu-black text-enugu-white'
                  : 'border-gray-200 hover:border-enugu-black'
            }`}
          >
            {item.size}
            {item.lowStock && !outOfStock && (
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-enugu-gold" />
            )}
          </button>
        );
      })}
    </div>

    {selected && sizes.find((s) => s.size === selected)?.lowStockMessage && (
      <p className="mt-2 text-xs font-medium text-enugu-gold">
        {sizes.find((s) => s.size === selected).lowStockMessage}
      </p>
    )}
  </div>
);

export default SizeSelector;
