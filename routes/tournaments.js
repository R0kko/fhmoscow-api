import { Router } from 'express';
import { param, query } from 'express-validator';

import authMiddleware from '../middlewares/authMiddleware.js';
import {
  listTournaments,
  getTournament,
  updateTournament,
} from '../controllers/tournamentController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tournaments
 *   description: Управление турнирами (только чтение/редактирование)
 * components:
 *   schemas:
 *     TournamentUpdate:
 *       type: object
 *       properties:
 *         full_name:   { type: string, example: "Открытый кубок Москвы" }
 *         short_name:  { type: string, example: "Кубок Мск" }
 *         date_start:  { type: string, format: date, example: "2025-06-01" }
 *         date_end:    { type: string, format: date, example: "2025-06-30" }
 *         year_of_birth: { type: integer, example: 2011 }
 *         hide_in_main_calendar: { type: boolean, example: false }
 */

const idParam = param('id')
  .isInt({ min: 1 })
  .withMessage('id должен быть положительным целым');

router.use(authMiddleware);

/**
 * @swagger
 * /tournaments:
 *   get:
 *     summary: Список турниров
 *     tags: [Tournaments]
 *     parameters:
 *       - in: query
 *         name: season
 *         schema:
 *           type: integer
 *         description: ID сезона
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Год рождения (фильтр)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер страницы (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Кол-во элементов на страницу (default 20)
 *     responses:
 *       200:
 *         description: Пагинированный список турниров
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  '/',
  [
    query('season').optional().isInt({ min: 1 }),
    query('year').optional().isInt({ min: 1900 }),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  listTournaments
);

/**
 * @swagger
 * /tournaments/{id}:
 *   get:
 *     summary: Детали турнира по ID
 *     tags: [Tournaments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Данные турнира
 *       404:
 *         description: Турнир не найден
 */
router.get('/:id', idParam, getTournament);

/**
 * @swagger
 * /tournaments/{id}:
 *   patch:
 *     summary: Обновить турнир
 *     tags: [Tournaments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TournamentUpdate'
 *     responses:
 *       200:
 *         description: Обновлённые данные турнира
 *       400:
 *         description: Некорректные данные
 *       404:
 *         description: Турнир не найден
 */
router.patch('/:id', idParam, updateTournament);

export default router;
