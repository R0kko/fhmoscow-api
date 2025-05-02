import { Router } from 'express';
import { query } from 'express-validator';

import authMiddleware from '../middlewares/authMiddleware.js';
import { listSeasons } from '../controllers/seasonController.js';

/**
 * @swagger
 * tags:
 *   name: Seasons
 *   description: Справочник сезонов (внешняя MariaDB)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Season:
 *       type: object
 *       properties:
 *         id:    { type: integer, example: 3 }
 *         name:  { type: string,  example: "24/25" }
 */

const router = Router();

// Авторизацию можно убрать, если список открытый
router.use(authMiddleware);

/**
 * @swagger
 * /seasons:
 *   get:
 *     tags: [Seasons]
 *     summary: Список сезонов (только object_status=new/active)
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 200 }
 *         description: Максимум элементов (по умолчанию 100)
 *     responses:
 *       200:
 *         description: Массив сезонов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Season' }
 */
router.get(
  '/',
  [query('limit').optional().isInt({ min: 1, max: 200 })],
  listSeasons
);

export default router;
