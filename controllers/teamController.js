const { param, query } = require('express-validator');

const TeamService = require('../services/teamService');
const logger = require('../utils/logger');

exports.teamIdParam = param('id')
  .isInt({ min: 1 })
  .withMessage('id команды должен быть положительным целым');

exports.listQueryValidators = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('year').optional().isInt({ min: 1900, max: 2100 }),
];

/**
 * GET /teams/:id — детальная информация о команде + игроки + штаб
 */
exports.getTeam = async (req, res, next) => {
  try {
    const team = await TeamService.getById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Команда не найдена' });
    }

    res.json(team);
  } catch (err) {
    logger.error('getTeam error', err);
    next(err);
  }
};

/**
 * GET /teams — список команд (минимальная информация)
 * ?page=1&limit=20&search=abc&year=2015
 *
 * Поддержка пагинации и поиска по short_name/full_name.
 * year — фильтр по году основания / возрасту.
 */
exports.listTeams = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, year } = req.query;

    const result = await TeamService.list({
      page: Number(page),
      limit: Number(limit),
      search,
      year: year ? Number(year) : undefined,
    });

    res.json(result);
  } catch (err) {
    logger.error('listTeams error', err);
    next(err);
  }
};
