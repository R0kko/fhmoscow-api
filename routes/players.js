import { Router } from 'express';
import { body, param, query } from 'express-validator';

/**
 * @swagger
 * tags:
 *   name: Players
 *   description: Операции с игроками (внешняя БД MariaDB)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PlayerInput:
 *       type: object
 *       properties:
 *         surname:   { type: string, example: Иванов }
 *         name:      { type: string, example: Алексей }
 *         patronymic:{ type: string, example: Сергеевич }
 *         email:     { type: string, format: email }
 *         height:    { type: integer, example: 180 }
 *         weight:    { type: integer, example: 75 }
 */

import authMiddleware from '../middlewares/authMiddleware.js';
import {
  getPlayer,
  listPlayers,
  updatePlayer,
  deletePlayer,
} from '../controllers/playerController.js';

const router = Router();

const idParam = param('id')
  .isInt({ min: 1 })
  .withMessage('id должен быть положительным целым');

const playerBodyValidators = [
  body('surname').optional().isString().isLength({ min: 2 }),
  body('name').optional().isString().isLength({ min: 2 }),
  body('email').optional().isEmail(),
  body('height').optional().isInt({ min: 50, max: 300 }),
  body('weight').optional().isInt({ min: 20, max: 300 }),
];

router.use(authMiddleware);

/**
 * @swagger
 * /players:
 *   get:
 *     tags: [Players]
 *     summary: Список игроков
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *         description: Номер страницы (по умолчанию 1)
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *         description: Кол-во элементов на страницу (по умолчанию 20)
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Поиск по ФИО / email
 *     responses:
 *       200:
 *         description: Массив игроков с пагинацией
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  listPlayers
);

/**
 * @swagger
 * /players/{id}:
 *   get:
 *     tags: [Players]
 *     summary: Получить игрока по id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: withStats
 *         schema: { type: boolean }
 *         description: Вернуть подробную статистику (true/false)
 *     responses:
 *       200: { description: OK }
 *       404: { description: Игрок не найден }
 */
router.get(
  '/:id',
  [idParam, query('withStats').optional().isBoolean()],
  getPlayer
);

/**
 * @swagger
 * /players/{id}:
 *   patch:
 *     tags: [Players]
 *     summary: Обновить игрока
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/PlayerInput' }
 *     responses:
 *       200: { description: OK }
 *       400: { description: Ошибка валидации }
 */
router.patch('/:id', [idParam, ...playerBodyValidators], updatePlayer);

/**
 * @swagger
 * /players/{id}:
 *   delete:
 *     tags: [Players]
 *     summary: Мягкое удаление игрока
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       204: { description: Успешно удалён }
 */
router.delete('/:id', idParam, deletePlayer);

export default router;
