import { Router } from 'express';

import authRouter from './auth.js';
import usersRouter from './users.js';
import playersRouter from './players.js';
import tournamentsRouter from './tournaments.js';
import seasonsRouter from './season.js';
import groupsRouter from './groups.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'ФХМ API' });
});

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/players', playersRouter);
router.use('/tournaments', tournamentsRouter);
router.use('/seasons', seasonsRouter);
router.use('/groups', groupsRouter);

export default router;
