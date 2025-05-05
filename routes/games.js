import { Router } from 'express';

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Операции с матчами
 */

import authMiddleware from '../middlewares/authMiddleware.js';
import {
  getGame,
  listGames,
  getLineups,
  gameIdParam,
  listQueryValidators,
} from '../controllers/gameController.js';

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /games:
 *   get:
 *     tags: [Games]
 *     summary: Список матчей
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *         description: Номер страницы (default 1)
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *         description: Кол-во элементов (default 20)
 *       - in: query
 *         name: dateFrom
 *         schema: { type: string, format: date }
 *         description: Дата начала (YYYY-MM-DD)
 *       - in: query
 *         name: dateTo
 *         schema: { type: string, format: date }
 *         description: Дата конца (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema: { type: integer }
 *         description: Статус матча
 *       - in: query
 *         name: teamId
 *         schema: { type: integer, minimum: 1 }
 *         description: ID одной из команд
 *       - in: query
 *         name: stadiumId
 *         schema: { type: integer, minimum: 1 }
 *         description: ID стадиона
 *       - in: query
 *         name: playerId
 *         schema: { type: integer, minimum: 1 }
 *         description: ID игрока
 *     responses:
 *       200: { description: OK }
 *       400: { description: Некорректные параметры }
 */
router.get('/', listQueryValidators, listGames);

/* ------------------------------------------------------------------ */
/*  DETAIL                                                             */
/* ------------------------------------------------------------------ */

/**
 * @swagger
 * /games/{id}/lineups:
 *   get:
 *     tags: [Games]
 *     summary: Составы команд на матч
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Матч или составы не найдены }
 */
router.get('/:id/lineups', gameIdParam, getLineups);

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     tags: [Games]
 *     summary: Детальная информация о матче
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Матч не найден }
 */
router.get('/:id', gameIdParam, getGame);

export default router;
