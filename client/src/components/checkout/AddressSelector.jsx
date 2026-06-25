const AddressSelector = ({
  addresses,
  selectedId,
  onSelect,
  onAddNew,
  showAddNew,
}) => (
  <div className="space-y-3">
    {addresses.map((address) => {
      const id = address._id ?? address.id;
      const isSelected = selectedId === id;

      return (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(address)}
          className={`w-full border p-4 text-left transition ${
            isSelected
              ? 'border-enugu-gold bg-enugu-gold/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-enugu-gold">
                {address.label}
                {address.isDefault && (
                  <span className="ml-2 text-gray-400">· Default</span>
                )}
              </p>
              <p className="mt-1 font-medium text-enugu-black">{address.fullName}</p>
              <p className="mt-1 text-sm text-gray-600">
                {address.addressLine1}
                {address.addressLine2 ? `, ${address.addressLine2}` : ''}
              </p>
              <p className="text-sm text-gray-600">
                {address.city}, {address.state} — {address.pincode}
              </p>
              <p className="mt-1 text-sm text-gray-500">{address.phone}</p>
            </div>
            <span
              className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
                isSelected ? 'border-enugu-gold bg-enugu-gold' : 'border-gray-300'
              }`}
            />
          </div>
        </button>
      );
    })}

    <button
      type="button"
      onClick={onAddNew}
      className={`w-full border border-dashed p-4 text-left text-sm uppercase tracking-wider transition ${
        showAddNew
          ? 'border-enugu-gold text-enugu-gold'
          : 'border-gray-300 text-gray-500 hover:border-enugu-black hover:text-enugu-black'
      }`}
    >
      + Add New Address
    </button>
  </div>
);

export default AddressSelector;
