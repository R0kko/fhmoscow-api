import { Router } from 'express';
import { param, query } from 'express-validator';

/**
 * @swagger
 * tags:
 *   name: TournamentTables
 *   description: Турнирные таблицы (позиции команд)
 */

import authMiddleware from '../middlewares/authMiddleware.js';
import { listRows, getRow } from '../controllers/tournamentTableController.js';

const router = Router();

const idParam = param('id')
  .isInt({ min: 1 })
  .withMessage('id должен быть положительным целым');

router.use(authMiddleware);

/**
 * @swagger
 * /tournamentTables:
 *   get:
 *     tags: [TournamentTables]
 *     summary: Список позиций таблицы
 *     parameters:
 *       - in: query
 *         name: moscowStanding
 *         required: true
 *         schema: { type: boolean }
 *         description: Флаг «московской» таблицы
 *       - in: query
 *         name: groupId
 *         schema: { type: integer, minimum: 1 }
 *         description: Фильтр по группе
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *         description: Номер страницы (default 1)
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *         description: Кол-во элементов (default 20)
 *     responses:
 *       200:
 *         description: Позиции турнирной таблицы
 */
router.get(
  '/',
  [
    query('stageId').exists().isInt({ min: 1 }),
    query('moscowStanding')
      .exists()
      .isBoolean()
      .withMessage('moscowStanding должен быть true/false или 1/0'),
    query('groupId').optional().isInt({ min: 1 }),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  listRows
);

/**
 * @swagger
 * /tables/{id}:
 *   get:
 *     tags: [TournamentTables]
 *     summary: Позиция таблицы по id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Запись не найдена }
 */
router.get('/:id', idParam, getRow);

export default router;
