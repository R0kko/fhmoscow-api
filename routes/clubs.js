import { Router } from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import {
  getClub,
  listClubs,
  updateClub,
  clubIdParam,
  listQueryValidators,
  updateBodyValidators,
} from '../controllers/clubController.js';

/**
 * @swagger
 * tags:
 *   name: Clubs
 *   description: Операции с клубами и их командами
 */

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /clubs:
 *   get:
 *     tags: [Clubs]
 *     summary: Список клубов (id, short_name, logo)
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
 *         name: search
 *         schema: { type: string }
 *         description: Поиск по названию
 *       - in: query
 *         name: isMoscow
 *         schema: { type: boolean }
 *         description: "Фильтр: только московские клубы"
 *     responses:
 *       200:
 *         description: Массив клубов с пагинацией
 */
router.get('/', listQueryValidators, listClubs);

/**
 * @swagger
 * /clubs/{id}:
 *   get:
 *     tags: [Clubs]
 *     summary: Получить информацию о клубе
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Клуб не найден }
 */
router.get('/:id', clubIdParam, getClub);

/**
 * @swagger
 * /clubs/{id}:
 *   patch:
 *     tags: [Clubs]
 *     summary: Обновить информацию о клубе (только администратор)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:     { type: string }
 *               short_name:    { type: string }
 *               email:         { type: string, format: email }
 *               phone:         { type: string }
 *               address:       { type: string }
 *               description:   { type: string }
 *               site:          { type: string, format: uri }
 *               is_moscow:     { type: boolean }
 *     responses:
 *       200: { description: OK }
 *       400: { description: Ошибка валидации }
 */
router.patch('/:id', [clubIdParam, ...updateBodyValidators], updateClub);

export default router;
