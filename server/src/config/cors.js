import cors from 'cors';
import env from './env.js';

const corsOptions = {
  origin(origin, callback) {
    if (!origin || env.security.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Request-Id'],
  maxAge: 86_400,
};

export default cors(corsOptions);
