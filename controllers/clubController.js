const { validationResult, param, body, query } = require('express-validator');

const ClubService = require('../services/clubService');
const logger = require('../utils/logger');

exports.clubIdParam = param('id')
  .isInt({ min: 1 })
  .withMessage('id клуба должен быть положительным целым');

exports.updateBodyValidators = [
  body('full_name').optional().isString().isLength({ min: 2 }),
  body('short_name').optional().isString().isLength({ min: 2 }),
  body('email').optional().isEmail(),
  body('phone').optional().isString().isLength({ min: 5 }),
  body('address').optional().isString(),
  body('description').optional().isString(),
  body('site').optional().isURL(),
  body('is_moscow').optional().isBoolean(),
];

exports.listQueryValidators = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('isMoscow').optional().isBoolean(),
];

/**
 * GET /clubs — список клубов (id, short_name, logo) с пагинацией
 * ?page=1&limit=20&search=text&isMoscow=true
 */
exports.listClubs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, isMoscow } = req.query;

    const result = await ClubService.list({
      page: Number(page),
      limit: Number(limit),
      search,
      isMoscow:
        isMoscow === undefined
          ? undefined
          : isMoscow === 'true' || isMoscow === '1',
    });

    res.json(result);
  } catch (err) {
    logger.error('listClubs error', err);
    next(err);
  }
};

/* ---------------------------------------------------------------- */
/*  Controllers                                                     */
/* ---------------------------------------------------------------- */

/**
 * GET /clubs/:id — информация о клубе + список команд
 */
exports.getClub = async (req, res, next) => {
  try {
    const club = await ClubService.getById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: 'Клуб не найден' });
    }

    res.json(club);
  } catch (err) {
    logger.error('getClub error', err);
    next(err);
  }
};

/**
 * PATCH /clubs/:id — изменить данные клуба (только admin)
 */
exports.updateClub = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: 'Некорректные данные', errors: errors.array() });
    }

    const updated = await ClubService.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    logger.error('updateClub error', err);
    next(err);
  }
};
