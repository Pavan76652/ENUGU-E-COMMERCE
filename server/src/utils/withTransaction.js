import mongoose from 'mongoose';

const isTransactionUnsupported = (error) => {
  const message = error?.message ?? '';
  return (
    error?.code === 20 ||
    error?.codeName === 'IllegalOperation' ||
    /Transaction numbers are only allowed on a replica set/i.test(message) ||
    /Transactions are not supported/i.test(message)
  );
};

/**
 * Runs `fn` inside a MongoDB transaction, passing the session as the only argument.
 * If the connected server is a standalone (no replica set) and therefore cannot
 * run transactions, it transparently falls back to running `fn(null)` without a
 * session. All writes inside `fn` MUST forward the received session to remain atomic.
 */
export const withTransaction = async (fn) => {
  const session = await mongoose.startSession();

  try {
    let result;
    await session.withTransaction(async () => {
      result = await fn(session);
    });
    return result;
  } catch (error) {
    if (isTransactionUnsupported(error)) {
      return fn(null);
    }
    throw error;
  } finally {
    await session.endSession();
  }
};

export default withTransaction;
