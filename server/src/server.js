import app from './app.js';
import env from './config/env.js';
import logger from './config/logger.js';
import { connectDB, disconnectDB } from './config/db.js';
import { bootstrapDevData } from './seeds/bootstrapDev.js';
import { ensureSuperAdmin } from './seeds/ensureSuperAdmin.js';
import { ensureDefaultCategories } from './seeds/ensureDefaultCategories.js';
import { ensureDefaultSizeGuide } from './seeds/ensureDefaultSizeGuide.js';
import { getCloudinaryStatus } from './config/cloudinary.js';
const startServer = async () => {
  await connectDB();
  await bootstrapDevData();
  await ensureSuperAdmin();
  await ensureDefaultCategories();
  await ensureDefaultSizeGuide();

  const server = app.listen(env.port, () => {
    const cloudinaryStatus = getCloudinaryStatus();
    logger.info(
      {
        env: env.nodeEnv,
        port: env.port,
        apiBase: `http://localhost:${env.port}/api/${env.apiVersion}`,
        cloudinary: cloudinaryStatus.configured
          ? `ready (${cloudinaryStatus.cloudName})`
          : 'not configured',
      },
      `ENUGU API running on port ${env.port}`
    );
  });
  const shutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);

    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error({ err: reason }, 'Unhandled Rejection');
    shutdown('unhandledRejection');
  });

  process.on('uncaughtException', (error) => {
    logger.error({ err: error }, 'Uncaught Exception');
    shutdown('uncaughtException');
  });
};

startServer();
