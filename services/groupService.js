const { Op } = require('sequelize');

const statDb = require('../models/stat');

class GroupService {
  /**
   * Вернуть список групп (stage/tournament).
   * Любой фильтр можно не передавать — вернётся полный список с учётом object_status.
   *
   * @param {Object} [filter]
   * @param {number} [filter.stageId]      Идентификатор этапа
   * @param {number} [filter.tournamentId] Идентификатор турнира
   * @param {number} [filter.limit=100]    Макс. элементов
   * @returns {Promise<Array>}
   */
  static async list({
    page = 1,
    limit = 20,
    stageId,
    tournamentId,
    search,
  } = {}) {
    const offset = (page - 1) * limit;

    const where = {
      object_status: { [Op.in]: ['new', 'active'] },
    };
    if (stageId) {
      where.stage_id = stageId;
    }
    if (tournamentId) {
      where.tournament_id = tournamentId;
    }
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    const { rows, count } = await statDb.Group.findAndCountAll({
      where,
      attributes: ['id', 'name', 'stage_id', 'tournament_id'],
      order: [['id', 'DESC']],
      limit,
      offset,
    });

    const data = rows.map((r) => r.get({ plain: true }));
    return { data, total: count, page, limit };
  }

  /**
   * Детали одной группы по id.
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async getById(id) {
    const row = await statDb.Group.findOne({
      where: {
        id,
        object_status: { [Op.ne]: 'deleted' },
      },
    });

    return row ? row.get({ plain: true }) : null;
  }

  /**
   * Обновить группу.
   * Допустимые поля: name, object_status
   * @param {number} id
   * @param {object} attrs
   */
  static async update(id, attrs = {}) {
    return statDb.sequelize.transaction(async (t) => {
      const group = await statDb.Group.findByPk(id, { transaction: t });
      if (!group) {
        throw new Error('Группа не найдена');
      }

      const allow = ['name', 'object_status'];
      const toUpdate = {};
      for (const key of allow) {
        if (attrs[key] !== undefined) {
          toUpdate[key] = attrs[key];
        }
      }
      toUpdate.date_update = new Date();

      await group.update(toUpdate, { transaction: t });
      return group.get({ plain: true });
    });
  }

  /**
   * Логическое удаление (archive)
   * @param {number} id
   */
  static async remove(id) {
    return statDb.Group.update(
      { object_status: 'archive', date_update: new Date() },
      { where: { id } }
    );
  }
}

module.exports = GroupService;
