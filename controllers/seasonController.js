import { validationResult } from 'express-validator';

import SeasonService from '../services/seasonService.js';

/**
 * GET /seasons — список сезонов (new + active)
 */
export async function listSeasons(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: 'Некорректные параметры', errors: errors.array() });
  }

  try {
    const limit = Number(req.query.limit) || 100;
    const seasons = await SeasonService.list(limit);
    res.json(seasons);
  } catch (err) {
    next(err);
  }
}
