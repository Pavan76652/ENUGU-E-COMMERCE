import dns from 'dns';
import mongoose from 'mongoose';
import env from './env.js';

mongoose.set('strictQuery', true);

let memoryServer = null;

/**
 * Atlas `mongodb+srv://` URIs require DNS SRV record lookups. Some networks
 * (college/office/public Wi-Fi) block these — use public DNS as fallback.
 */
const configureDnsForAtlas = () => {
  if (!env.mongodb.uri.startsWith('mongodb+srv://')) return;

  const existing = dns.getServers();
  const publicDns = ['8.8.8.8', '1.1.1.1'];
  dns.setServers([...publicDns, ...existing.filter((s) => !publicDns.includes(s))]);
};

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
    configureDnsForAtlas();
    const uri = await resolveMongoUri();

    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
    });

    console.log(`MongoDB connected: ${conn.connection.host} (db: ${conn.connection.name})`);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);

    if (error.message?.includes('querySrv') || error.message?.includes('ECONNREFUSED')) {
      console.error(
        '\nDNS could not resolve your Atlas cluster. Try:\n' +
          '  1. Switch to mobile hotspot or another network\n' +
          '  2. In Atlas → Network Access → allow 0.0.0.0/0\n' +
          '  3. Use the standard (non-SRV) connection string from Atlas\n'
      );
    }

    if (error.message?.includes('bad auth')) {
      console.error(
        '\nAuthentication failed — username or password in MONGODB_URI is wrong.\n' +
          '  1. Atlas → Database Access → verify user "goudarjun763_db_user"\n' +
          '  2. Edit password → copy the new connection string into server/.env\n' +
          '  3. Restart the server (nodemon: type rs)\n'
      );
    }

    if (env.isDevelopment) {
      console.error(
        '\nLocal dev fallback: set MONGODB_URI=memory in server/.env (data resets on restart)\n'
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
