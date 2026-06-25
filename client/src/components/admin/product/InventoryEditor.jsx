import { PRODUCT_SIZES } from '../../../constants/products';

const InventoryEditor = ({ sizeStock, onChange, errors = {} }) => {
  const getRow = (size) => sizeStock.find((s) => s.size === size) ?? { size, stock: 0, lowStockThreshold: 5 };

  const updateRow = (size, field, value) => {
    const next = PRODUCT_SIZES.map((s) => {
      const row = getRow(s);
      if (s === size) {
        return { ...row, [field]: field === 'stock' || field === 'lowStockThreshold' ? Number(value) || 0 : value };
      }
      return row;
    });
    onChange(next);
  };

  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">Size inventory</p>
      {errors.sizeStock && (
        <p className="mb-2 text-sm text-red-600">{errors.sizeStock}</p>
      )}
      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Size', 'Stock', 'Low stock alert'].map((head) => (
                <th key={head} className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {PRODUCT_SIZES.map((size) => {
              const row = getRow(size);
              return (
                <tr key={size}>
                  <td className="px-4 py-2 font-medium text-enugu-black">{size}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      value={row.stock}
                      onChange={(e) => updateRow(size, 'stock', e.target.value)}
                      className="w-24 rounded border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-enugu-gold"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      value={row.lowStockThreshold}
                      onChange={(e) => updateRow(size, 'lowStockThreshold', e.target.value)}
                      className="w-24 rounded border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-enugu-gold"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryEditor;
