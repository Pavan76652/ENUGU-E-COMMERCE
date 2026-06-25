import { PAYMENT_METHOD_OPTIONS } from '../../constants/checkout';

const PaymentMethodSelector = ({ selected, onChange }) => (
  <div className="space-y-3">
    {PAYMENT_METHOD_OPTIONS.map((method) => {
      const isSelected = selected === method.id;

      return (
        <button
          key={method.id}
          type="button"
          disabled={!method.available}
          onClick={() => method.available && onChange(method.id)}
          className={`w-full border p-4 text-left transition ${
            !method.available
              ? 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-60'
              : isSelected
                ? 'border-enugu-gold bg-enugu-gold/5'
                : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-enugu-black">{method.label}</p>
                {method.badge && (
                  <span className="bg-gray-200 px-2 py-0.5 text-[10px] uppercase tracking-wider text-gray-600">
                    {method.badge}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">{method.description}</p>
            </div>
            {method.available && (
              <span
                className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
                  isSelected ? 'border-enugu-gold bg-enugu-gold' : 'border-gray-300'
                }`}
              />
            )}
          </div>
        </button>
      );
    })}
  </div>
);

export default PaymentMethodSelector;
