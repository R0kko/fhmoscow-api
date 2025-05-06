import { param, query, validationResult } from 'express-validator';

import RefereeService from '../services/refereeService.js';
import logger from '../utils/logger.js';

/**
 * GET /referees/:refereeId/games
 * Список всех матчей c участием судьи + статус подтверждения.
 */
export const listGames = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user?.id;

    try {
      const { rows, count } = await RefereeService.listForUser({
        userId,
      });

      res.json({
        data: rows,
        total: typeof count === 'number' ? count : (count?.total ?? 0),
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
      });
    } catch (err) {
      logger.error(`listGames error: ${err.message}`);
      res.status(500).json({ message: 'Не удалось получить список матчей' });
    }
  },
];

/**
 * POST /referees/:refereeId/games/:gameId/confirm
 * Подтвердить назначение на матч.
 */
export const confirmGame = [
  param('gameId').isInt({ gt: 0 }).toInt(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user?.id;
    const gameId = Number(req.params.gameId);

    try {
      await RefereeService.confirm(userId, gameId, true);
      res.status(204).end();
    } catch (err) {
      logger.error(`confirmGame error: ${err.message}`);
      res.status(500).json({ message: 'Не удалось подтвердить назначение' });
    }
  },
];

/**
 * DELETE /referees/:refereeId/games/:gameId/confirm
 * Снять подтверждение.
 */
export const revokeConfirmation = [
  param('gameId').isInt({ gt: 0 }).toInt(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user?.id;
    const gameId = Number(req.params.gameId);

    try {
      await RefereeService.confirm(userId, gameId, false);
      res.status(204).end();
    } catch (err) {
      logger.error(`revokeConfirmation error: ${err.message}`);
      res.status(500).json({ message: 'Не удалось снять подтверждение' });
    }
  },
];
