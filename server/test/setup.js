// Configure environment BEFORE any app module (which validates env on import).
process.env.NODE_ENV = 'test';
process.env.CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173';
process.env.MONGODB_URI = process.env.MONGODB_URI ?? 'memory';
process.env.JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET ?? 'test_access_secret_at_least_32_chars_long_xx';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ?? 'test_refresh_secret_at_least_32_chars_long_x';
process.env.BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS ?? '10';

import { afterAll, afterEach, beforeAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

let replSet;

beforeAll(async () => {
  // Replica set (not standalone) so MongoDB transactions work in tests.
  replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(replSet.getUri('enugu_test'));
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({}))
  );
});

afterAll(async () => {
  await mongoose.connection.dropDatabase().catch(() => {});
  await mongoose.disconnect();
  if (replSet) await replSet.stop();
});
