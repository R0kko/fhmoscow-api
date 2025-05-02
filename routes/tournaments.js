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
 *     Stage:
 *       type: object
 *       properties:
 *         id:        { type: integer, example: 1 }
 *         name:      { type: string,  example: "Первый этап" }
 *         play_off:  { type: boolean, example: false }
 *         current:   { type: boolean, example: true }
 *         transition:{ type: boolean, example: false }
 *     Tournament:
 *       type: object
 *       properties:
 *         id:          { type: integer, example: 11 }
 *         full_name:   { type: string }
 *         short_name:  { type: string }
 *         year_of_birth:{ type: integer, example: 2015 }
 *         type:        { type: string, example: "Кубок Москвы" }
 *         season:      { type: string, example: "24/25" }
 *         logo:        { type: string, format: uri }
 *       required: [id, full_name]
 *     TournamentDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/Tournament'
 *         - type: object
 *           properties:
 *             stages:
 *               type: array
 *               items: { $ref: '#/components/schemas/Stage' }
 *     TournamentUpdate:
 *       type: object
 *       properties:
 *         full_name:   { type: string, example: "Открытый кубок Москвы" }
 *         short_name:  { type: string, example: "Кубок Мск" }
 *         date_start:  { type: string, format: date, example: "2025-06-01" }
 *         date_end:    { type: string, format: date, example: "2025-06-30" }
 *         year_of_birth: { type: integer, example: 2011 }
 *         hide_in_main_calendar: { type: boolean, example: false }
 *   responses:
 *     UnauthorizedError:
 *       description: Потребуется авторизация JWT
 *     BadRequestError:
 *       description: Некорректные параметры запроса
 *     NotFoundError:
 *       description: Ресурс не найден
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Tournament' }
 *                 page:  { type: integer, example: 1 }
 *                 total: { type: integer, example: 42 }
 *       400: { $ref: '#/components/responses/BadRequestError' }
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
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
 *         description: Детальная информация о турнире
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TournamentDetail' }
 *       404: { $ref: '#/components/responses/NotFoundError' }
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
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
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TournamentDetail' }
 *       400: { $ref: '#/components/responses/BadRequestError' }
 *       404: { $ref: '#/components/responses/NotFoundError' }
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 */
router.patch('/:id', idParam, updateTournament);

export default router;
