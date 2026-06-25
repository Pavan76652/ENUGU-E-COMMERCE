import express from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import corsMiddleware from './config/cors.js';
import env from './config/env.js';
import logger from './config/logger.js';
import apiRoutes from './routes/index.js';
import requestId from './middleware/requestId.middleware.js';
import { globalRateLimiter } from './middleware/rateLimit.middleware.js';
import notFound from './middleware/notFound.middleware.js';
import errorHandler from './middleware/error.middleware.js';

const app = express();

app.set('trust proxy', 1);

app.use(requestId);
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.id,
    autoLogging: {
      ignore: (req) => req.url === `/api/${env.apiVersion}/health`,
    },
    customLogLevel: (_req, res, err) => {
      if (res.statusCode >= 500 || err) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    serializers: {
      req: (req) => ({ method: req.method, url: req.url }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
  })
);
app.use(helmet());
app.use(corsMiddleware);
app.use(globalRateLimiter);

app.use(
  express.json({
    limit: '10kb',
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'ENUGU API',
    tagline: 'Made to Stand Out',
    version: env.apiVersion,
    docs: `/api/${env.apiVersion}/health`,
    authDocs: '/docs/api-auth.md',
  });
});

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
