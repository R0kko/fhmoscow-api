import { Router } from 'express';

import authRouter from './auth.js';
import usersRouter from './users.js';
import playersRouter from './players.js';
import tournamentsRouter from './tournaments.js';
import seasonsRouter from './season.js';
import groupsRouter from './groups.js';
import tournamentTablesRouter from './tournamentTables.js';
import clubsRouter from './clubs.js';
import teamRouter from './team.js';
import gamesRouter from './games.js';
import refereesRouter from './referees.js';
import documentsRouter from './documents.js';

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
router.use('/tournamentTables', tournamentTablesRouter);
router.use('/clubs', clubsRouter);
router.use('/teams', teamRouter);
router.use('/games', gamesRouter);
router.use('/referees', refereesRouter);
router.use('/documents', documentsRouter);

export default router;
