import path from 'path';
import { fileURLToPath } from 'url';

import winston from 'winston';
import { config } from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import swaggerDefinition from './docs/swaggerDef.js';
import indexRouter from './routes/index.js';
import db from './models/main/index.js';
import maria from './models/stat/index.js';

config();

const app = express();

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: [
    path.join(__dirname, 'routes', '**', '*.js'),
    path.join(__dirname, 'models', '**', '*.js'),
  ],
});

async function initializeDatabase() {
  try {
    await db.sequelize.authenticate();
    logger.info('Подключение к PostgreSQL успешно установлено.');

    await maria.sequelize.authenticate();
    logger.info('Подключение к MariaDB успешно установлено.');
  } catch (error) {
    logger.error(`Ошибка подключения к базе данных: ${error.message}`);
    throw new Error(`Ошибка подключения к базе данных: ${error.message}`);
  }
}

(async () => {
  await initializeDatabase();
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  const apiLimiter = rateLimit({
    windowMs: Number(process.env.RATE_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_MAX) || 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  });

  app.use(apiLimiter);

  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/', indexRouter);
})();

export default app;
export { maria };
