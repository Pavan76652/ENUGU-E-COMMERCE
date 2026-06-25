import pino from 'pino';
import env from './env.js';

const logger = pino({
  level: env.logLevel,
  base: { service: 'enugu-api' },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      '*.password',
      'refreshToken',
      '*.refreshToken',
    ],
    censor: '[redacted]',
  },
  transport: env.isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:HH:MM:ss',
          ignore: 'pid,hostname,service',
        },
      },
});

export default logger;
