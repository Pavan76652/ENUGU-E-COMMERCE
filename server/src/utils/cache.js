/**
 * Minimal in-memory TTL cache for read-heavy, slow-changing storefront data.
 * Single-process only — for horizontally scaled deployments replace with Redis.
 * A short TTL bounds staleness so explicit invalidation is not required.
 */
const store = new Map();

export const getCached = (key) => {
  const entry = store.get(key);
  if (!entry) return undefined;

  if (entry.expiresAt <= Date.now()) {
    store.delete(key);
    return undefined;
  }

  return entry.value;
};

export const setCached = (key, value, ttlMs) => {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
};

export const clearCache = (key) => {
  if (key) {
    store.delete(key);
  } else {
    store.clear();
  }
};

/**
 * Returns the cached value for `key`, or runs `producer`, caches and returns it.
 * Concurrent callers during a miss may each run `producer`; acceptable for the
 * idempotent reads this cache targets.
 */
export const cacheWrap = async (key, ttlMs, producer) => {
  const cached = getCached(key);
  if (cached !== undefined) return cached;

  const value = await producer();
  return setCached(key, value, ttlMs);
};

export default { getCached, setCached, clearCache, cacheWrap };
