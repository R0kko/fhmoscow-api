const TournamentService = require('../services/tournamentService');
const {
  validateTournamentUpdate,
} = require('../validators/tournamentValidators');

/**
 * GET /tournaments
 * query: ?season= ?year= ?page= ?limit=
 */
exports.listTournaments = async (req, res, next) => {
  try {
    const { season, year, page, limit } = req.query;
    const result = await TournamentService.list({
      seasonId: season,
      yearOfBirth: year,
      page,
      limit,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /tournaments/:id
 */
exports.getTournament = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = await TournamentService.get(id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /tournaments/:id
 */
exports.updateTournament = async (req, res, next) => {
  try {
    // Валидация
    const { error, value } = validateTournamentUpdate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: 'Некорректные данные', errors: error.details });
    }

    const id = Number(req.params.id);
    const data = await TournamentService.update(id, value);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
