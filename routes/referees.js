import { Router } from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import {
  revokeConfirmation,
  listGames,
  confirmGame,
} from '../controllers/refereeController.js';

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: RefereeGames
 *   description: Управление назначениями и подтверждениями судей
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RefereeGameRow:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Идентификатор игры
 *         date_start:
 *           type: string
 *           format: date-time
 *           description: Дата и время начала матча (МСК)
 *         stadium:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             city:
 *               type: string
 *         team1:
 *           type: object
 *           properties:
 *             id:    { type: integer }
 *             name:  { type: string }
 *             logo_url:
 *               type: string
 *               format: uri
 *         team2:
 *           allOf:
 *             - $ref: '#/components/schemas/RefereeGameRow/properties/team1'
 *         confirmed:
 *           type: boolean
 *           description: Признак подтверждения назначения судьёй
 */

/**
 * @swagger
 * /referees/games:
 *   get:
 *     summary: Список игр, назначенных конкретному судье
 *     tags: [RefereeGames]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RefereeGameRow'
 *                 total: { type: integer }
 *                 page:  { type: integer }
 *                 limit: { type: integer }
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/games', listGames);

/**
 * @swagger
 * /referees/games/{gameId}/confirm:
 *   patch:
 *     summary: Подтвердить своё назначение на матч
 *     tags: [RefereeGames]
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Подтверждение сохранено
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.patch('/games/:gameId/confirm', confirmGame);

/**
 * @swagger
 * /referees/games/{gameId}/unconfirm:
 *   patch:
 *     summary: Отозвать подтверждение назначения
 *     tags: [RefereeGames]
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Подтверждение удалено
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.patch('/games/:gameId/unconfirm', revokeConfirmation);

export default router;
