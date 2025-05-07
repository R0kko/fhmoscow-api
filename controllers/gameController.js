const { validationResult, param, query } = require('express-validator');

const GameService = require('../services/gameService');
const logger = require('../utils/logger');

exports.gameIdParam = param('id')
  .isInt({ min: 1 })
  .withMessage('id матча должен быть положительным целым');

exports.listQueryValidators = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601(),
  query('status').optional().isInt(),
  query('teamId').optional().isInt({ min: 1 }),
  query('stadiumId').optional().isInt({ min: 1 }),
  query('playerId').optional().isInt({ min: 1 }),
];

/**
 * GET /games/:id  — детальная карточка матча
 */
exports.getGame = async (req, res, next) => {
  try {
    const game = await GameService.getById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Матч не найден' });
    }
    res.json(game);
  } catch (err) {
    logger.error('getGame error', err);
    next(err);
  }
};

/**
 * GET /games/:id/lineups — составы обеих команд на матч
 */
exports.getLineups = async (req, res, next) => {
  try {
    const squads = await GameService.getLineups(req.params.id);

    if (!squads) {
      return res.status(404).json({ message: 'Составы для матча не найдены' });
    }

    res.json(squads);
  } catch (err) {
    logger.error('getLineups error', err);
    next(err);
  }
};

/**
 * GET /games  — список матчей
 *   ?page=1&limit=20&dateFrom=2025-05-01&dateTo=2025-05-31
 *   &status=1&teamId=10&stadiumId=3&playerId=123
 */
exports.listGames = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: 'Некорректные параметры', errors: errors.array() });
    }

    const {
      page = 1,
      limit = 20,
      dateFrom,
      dateTo,
      status,
      teamId,
      stadiumId,
      playerId,
    } = req.query;

    const result = await GameService.list({
      page: Number(page),
      limit: Number(limit),
      dateFrom,
      dateTo,
      status: status ? Number(status) : undefined,
      teamId: teamId ? Number(teamId) : undefined,
      stadiumId: stadiumId ? Number(stadiumId) : undefined,
      playerId: playerId ? Number(playerId) : undefined,
    });

    res.json(result);
  } catch (err) {
    logger.error('listGames error', err);
    next(err);
  }
};
