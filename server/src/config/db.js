import mongoose from 'mongoose';
import env from './env.js';

mongoose.set('strictQuery', true);

let memoryServer = null;

const resolveMongoUri = async () => {
  const configured = env.mongodb.uri;

  if (configured !== 'memory') {
    return configured;
  }

  // Use a single-node replica set (not a standalone) so MongoDB transactions
  // work in local development, matching production (Atlas / replica set).
  const { MongoMemoryReplSet } = await import('mongodb-memory-server');
  memoryServer = await MongoMemoryReplSet.create({
    replSet: { count: 1 },
  });
  const uri = memoryServer.getUri('enugu');
  console.log('Using in-memory MongoDB replica set for local development');
  return uri;
};

const connectDB = async () => {
  try {
    const uri = await resolveMongoUri();

    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5_000,
      socketTimeoutMS: 45_000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    if (env.isDevelopment) {
      console.error(
        '\nLocal dev tip: set MONGODB_URI=memory in server/.env (no MongoDB install required)\n' +
          'Or install MongoDB Community / use MongoDB Atlas and update MONGODB_URI.\n'
      );
    }
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.connection.close();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
  console.log('MongoDB connection closed');
};

export { connectDB, disconnectDB };
