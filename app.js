import winston from 'winston';
import { config } from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import authRouter from './routes/auth.js';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import db from './models/index.js';

config();

const app = express();

// Настраиваем Winston для логирования
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()]
});

async function initializeDatabase() {
  try {
    await db.sequelize.authenticate();
    logger.info('Подключение к базе данных успешно установлено.');
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

  app.use('/auth', authRouter);
  app.use('/', indexRouter);
  app.use('/users', usersRouter);
})();

export default app;