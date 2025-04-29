import { Router } from 'express';

import authRouter from './auth.js';
import usersRouter from './users.js';
import playersRouter from './players.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'ФХМ API' });
});

// Маршруты модулей
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/players', playersRouter);

export default router;
