import { Router } from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import {
  getTeam,
  listTeams,
  teamIdParam,
  listQueryValidators,
} from '../controllers/teamController.js';

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: Операции с командами
 */

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /teams:
 *   get:
 *     tags: [Teams]
 *     summary: Список команд
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
 *         name: year
 *         schema: { type: integer, minimum: 1900, maximum: 2100 }
 *         description: Фильтр по году (year)
 *     responses:
 *       200:
 *         description: Массив команд с пагинацией
 */
router.get('/', listQueryValidators, listTeams);

/**
 * @swagger
 * /teams/{id}:
 *   get:
 *     tags: [Teams]
 *     summary: Детальная информация о команде
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Команда не найдена }
 */
router.get('/:id', teamIdParam, getTeam);

export default router;
