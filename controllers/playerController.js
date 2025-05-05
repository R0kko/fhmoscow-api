const { validationResult } = require('express-validator');

const PlayerService = require('../services/playerService');
const logger = require('../utils/logger');

/**
 * GET /players/:id – возвращает одного игрока
 * ?withStats=true – дополнительно отдать агрегированную статистику по командам
 */
exports.getPlayer = async (req, res, next) => {
  try {
    const withStats = req.query.withStats === 'true';
    const player = withStats
      ? await PlayerService.getWithStats(req.params.id)
      : await PlayerService.getById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Игрок не найден' });
    }
    res.json(player);
  } catch (err) {
    logger.error('getPlayer error', err);
    next(err);
  }
};

/**
 * GET /players – список игроков с пагинацией / поиском
 * ?page=1&limit=20&search=abc
 */
exports.listPlayers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const result = await PlayerService.list({
      page: Number(page),
      limit: Number(limit),
      search,
    });
    res.json(result);
  } catch (err) {
    logger.error('listPlayers error', err);
    next(err);
  }
};

/**
 * PATCH /players/:id – обновить
 */
exports.updatePlayer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: 'Некорректные данные', errors: errors.array() });
    }

    const player = await PlayerService.update(req.params.id, req.body);
    res.json(player);
  } catch (err) {
    logger.error('updatePlayer error', err);
    next(err);
  }
};

/**
 * DELETE /players/:id – логическое удаление
 */
exports.deletePlayer = async (req, res, next) => {
  try {
    await PlayerService.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    logger.error('deletePlayer error', err);
    next(err);
  }
};
