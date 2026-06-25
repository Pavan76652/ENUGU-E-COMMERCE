const QuantitySelector = ({ quantity, onChange, max = 10, disabled = false }) => (
  <div>
    <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-enugu-black">Quantity</h3>
    <div className={`mt-3 inline-flex items-center border border-gray-200 ${disabled ? 'opacity-50' : ''}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="flex h-11 w-11 items-center justify-center text-lg transition hover:bg-gray-50 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="flex h-11 w-12 items-center justify-center border-x border-gray-200 text-sm font-medium">
        {quantity}
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className="flex h-11 w-11 items-center justify-center text-lg transition hover:bg-gray-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  </div>
);

export default QuantitySelector;
