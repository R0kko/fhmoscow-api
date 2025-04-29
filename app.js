import path from 'path';
import { fileURLToPath } from 'url';

import winston from 'winston';
import { config } from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import swaggerDefinition from './docs/swaggerDef.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
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

  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Swagger UI available at /api/docs
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/auth', authRouter);
  app.use('/users', usersRouter);
})();

export default app;
export { maria };
