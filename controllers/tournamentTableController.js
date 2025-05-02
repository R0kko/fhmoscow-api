const TournamentTableService = require('../services/tournamentTableService');
const logger = require('../utils/logger');

/**
 * GET /tables/:id — одна запись таблицы
 */
exports.getRow = async (req, res, next) => {
  try {
    const row = await TournamentTableService.getById(req.params.id);
    if (!row) {
      return res.status(404).json({ message: 'Запись не найдена' });
    }
    res.json(row);
  } catch (err) {
    logger.error('getRow error', err);
    next(err);
  }
};

/**
 * GET /tables — список позиций таблицы
 * ?stageId=24&moscowStanding=1&groupId=5&page=1&limit=20
 */
exports.listRows = async (req, res, next) => {
  try {
    const { moscowStanding, groupId, page = 1, limit = 20 } = req.query;

    if (!groupId || moscowStanding === undefined) {
      return res.status(400).json({
        message: 'groupId и moscowStanding обязательны',
      });
    }

    const result = await TournamentTableService.list({
      moscowStanding: moscowStanding === '1' || moscowStanding === 'true',
      groupId: Number(groupId),
      page: Number(page),
      limit: Number(limit),
    });

    res.json(result);
  } catch (err) {
    logger.error('listRows error', err);
    next(err);
  }
};
