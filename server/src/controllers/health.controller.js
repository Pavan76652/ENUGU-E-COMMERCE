import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import env from '../config/env.js';
import mongoose from 'mongoose';

const DB_STATUS = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

export const getHealth = asyncHandler(async (_req, res) => {
  const dbState = mongoose.connection.readyState;

  // Deeper check: actively ping the database rather than trusting connection state.
  let dbReachable = false;
  let dbLatencyMs = null;

  if (dbState === 1) {
    try {
      const start = Date.now();
      await mongoose.connection.db.admin().ping();
      dbLatencyMs = Date.now() - start;
      dbReachable = true;
    } catch {
      dbReachable = false;
    }
  }

  const healthy = dbState === 1 && dbReachable;

  const memory = process.memoryUsage();

  const health = {
    status: healthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
    version: env.apiVersion,
    uptime: process.uptime(),
    database: {
      state: DB_STATUS[dbState] ?? 'unknown',
      reachable: dbReachable,
      latencyMs: dbLatencyMs,
    },
    memory: {
      rssMb: Math.round(memory.rss / 1024 / 1024),
      heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
    },
  };

  const statusCode = healthy ? 200 : 503;

  res
    .status(statusCode)
    .json(new ApiResponse(statusCode, health, 'Health check complete'));
});
