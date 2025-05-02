import { Router } from 'express';
import { body, param, query } from 'express-validator';

import authMiddleware from '../middlewares/authMiddleware.js';
import {
  getGroup,
  listGroups,
  updateGroup,
  deleteGroup,
} from '../controllers/groupController.js';

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Операции с группами турниров (стат. БД)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     GroupInput:
 *       type: object
 *       properties:
 *         name:          { type: string, example: "Группа А" }
 *         object_status: { type: string, example: "active" }
 */

const router = Router();

const idParam = param('id')
  .isInt({ min: 1 })
  .withMessage('id должен быть положительным целым');

const groupBodyValidators = [
  body('name').optional().isString().isLength({ min: 2 }),
  body('object_status')
    .optional()
    .isIn(['new', 'active', 'archived', 'deleted']),
];

router.use(authMiddleware);

/**
 * @swagger
 * /groups:
 *   get:
 *     tags: [Groups]
 *     summary: Список групп
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *         description: Номер страницы (по умолчанию 1)
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *         description: Кол-во элементов (по умолчанию 20)
 *       - in: query
 *         name: stageId
 *         schema: { type: integer, minimum: 1 }
 *         description: Фильтр по этапу
 *       - in: query
 *         name: tournamentId
 *         schema: { type: integer, minimum: 1 }
 *         description: Фильтр по турниру
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Поиск по названию
 *     responses:
 *       200:
 *         description: Массив групп c пагинацией
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('stageId').optional().isInt({ min: 1 }),
    query('tournamentId').optional().isInt({ min: 1 }),
  ],
  listGroups
);

/**
 * @swagger
 * /groups/{id}:
 *   get:
 *     tags: [Groups]
 *     summary: Получить группу по id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Группа не найдена }
 */
router.get('/:id', idParam, getGroup);

/**
 * @swagger
 * /groups/{id}:
 *   patch:
 *     tags: [Groups]
 *     summary: Обновить группу
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GroupInput' }
 *     responses:
 *       200: { description: OK }
 *       400: { description: Ошибка валидации }
 */
router.patch('/:id', [idParam, ...groupBodyValidators], updateGroup);

/**
 * @swagger
 * /groups/{id}:
 *   delete:
 *     tags: [Groups]
 *     summary: Мягкое удаление группы
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       204: { description: Успешно удалена }
 */
router.delete('/:id', idParam, deleteGroup);

export default router;
