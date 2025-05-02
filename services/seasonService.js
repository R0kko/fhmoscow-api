import { Op } from 'sequelize';

import statDb from '../models/stat/index.js';

class SeasonService {
  /**
   * Вернуть массив сезонов со статусом new/active.
   * @param {number} limit Максимум элементов (по умолчанию 100)
   */
  static async list(limit = 100) {
    const rows = await statDb.Season.findAll({
      where: { object_status: { [Op.in]: ['new', 'active'] } },
      attributes: ['id', 'name'],
      order: [['id', 'DESC']],
      limit,
    });
    return rows.map((r) => r.get({ plain: true }));
  }
}

export default SeasonService;
