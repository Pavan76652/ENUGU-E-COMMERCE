import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import { ROLES } from '../constants/roles.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const resolveMongoUri = async () => {
  const configured = process.env.MONGODB_URI;
  if (configured !== 'memory') return configured;

  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const mongod = await MongoMemoryServer.create();
  return mongod.getUri('enugu');
};

const seedSuperAdmin = async () => {  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log('Super admin seed skipped — SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not set');
    return;
  }

  if (password.length < 8) {
    console.error('Super admin seed failed — password must be at least 8 characters');
    process.exit(1);
  }

  await mongoose.connect(await resolveMongoUri());

  const existing = await User.findByEmail(email);

  if (existing) {
    if (existing.role !== ROLES.SUPER_ADMIN) {
      console.error(`User ${email} exists but is not a super admin`);
      process.exit(1);
    }

    console.log(`Super admin already exists: ${email}`);
    await mongoose.connection.close();
    return;
  }

  await User.create({
    firstName: process.env.SUPER_ADMIN_FIRST_NAME || 'Super',
    lastName: process.env.SUPER_ADMIN_LAST_NAME || 'Admin',
    email,
    password,
    role: ROLES.SUPER_ADMIN,
    isEmailVerified: true,
    isActive: true,
  });

  console.log(`Super admin created: ${email}`);
  await mongoose.connection.close();
};

seedSuperAdmin().catch((err) => {
  console.error('Super admin seed failed:', err.message);
  process.exit(1);
});
