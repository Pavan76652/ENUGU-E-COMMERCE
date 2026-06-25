export const generateOrderNumber = async (OrderModel) => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const random = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ENUGU-${date}-${random}`;
    const exists = await OrderModel.exists({ orderNumber });

    if (!exists) return orderNumber;
  }

  const fallback = `ENUGU-${date}-${Date.now().toString().slice(-6)}`;
  return fallback;
};
