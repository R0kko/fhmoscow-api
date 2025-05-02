const { validationResult } = require('express-validator');

const GroupService = require('../services/groupService');
const logger = require('../utils/logger');

/**
 * GET /groups/:id — детальная информация о группе
 */
exports.getGroup = async (req, res, next) => {
  try {
    const group = await GroupService.getById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' });
    }

    res.json(group);
  } catch (err) {
    logger.error('getGroup error', err);
    next(err);
  }
};

/**
 * GET /groups — список групп
 * ?page=1&limit=20&stageId=3&tournamentId=5&search=ABC
 *
 * *search* — фильтр по части имени (опционально)
 */
exports.listGroups = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, stageId, tournamentId, search } = req.query;

    const result = await GroupService.list({
      page: Number(page),
      limit: Number(limit),
      stageId: stageId ? Number(stageId) : undefined,
      tournamentId: tournamentId ? Number(tournamentId) : undefined,
      search,
    });

    res.json(result);
  } catch (err) {
    logger.error('listGroups error', err);
    next(err);
  }
};

/**
 * PATCH /groups/:id — изменить название или статус
 */
exports.updateGroup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: 'Некорректные данные', errors: errors.array() });
    }

    const group = await GroupService.update(req.params.id, req.body);
    res.json(group);
  } catch (err) {
    logger.error('updateGroup error', err);
    next(err);
  }
};

/**
 * DELETE /groups/:id — логическое удаление
 */
exports.deleteGroup = async (req, res, next) => {
  try {
    await GroupService.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    logger.error('deleteGroup error', err);
    next(err);
  }
};
