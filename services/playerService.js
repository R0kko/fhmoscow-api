const { Op } = require('sequelize');

const statDb = require('../models/stat');

const FileService = require('./fileService');

class PlayerService {
  /**
   * Получить игрока по id (вместе c полом и фото)
   * @param {number} id
   */
  static async getById(id) {
    const player = await statDb.Player.findByPk(id, {
      include: [
        { model: statDb.Sex, as: 'sex', attributes: ['id', 'name'] },
        {
          model: statDb.File,
          as: 'photo',
          attributes: ['id', 'path', 'original_name', 'mime_type'],
        },
      ],
    });
    if (!player) {
      return null;
    }

    const plain = player.get({ plain: true });
    // формируем прямую ссылку на фото, если есть
    if (plain.photo && plain.photo.id) {
      try {
        plain.photo_url = await FileService.url(
          plain.photo.id,
          'clubPlayerPhoto'
        );
      } catch (e) {
        console.error('FileService.url error:', e.message);
      }
    }

    return plain;
  }

  /**
   * Список игроков c пагинацией
   * @param {object} opts { page = 1, limit = 20, search }
   */
  static async list({ page = 1, limit = 20, search } = {}) {
    const offset = (page - 1) * limit;
    const where = {};
    if (search) {
      const term = `%${search}%`;
      const { col, fn, where: rawWhere } = statDb.sequelize;

      where[Op.or] = [
        rawWhere(col('Player.surname'), { [Op.like]: term }),
        rawWhere(col('Player.name'), { [Op.like]: term }),
        rawWhere(col('Player.patronymic'), { [Op.like]: term }),
        // поиск по конкатенации ФИО
        rawWhere(
          fn(
            'concat',
            col('Player.surname'),
            ' ',
            col('Player.name'),
            ' ',
            col('Player.patronymic')
          ),
          { [Op.like]: term }
        ),
      ];
    }

    const { rows, count } = await statDb.Player.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
      include: [{ model: statDb.Sex, as: 'sex', attributes: ['name'] }],
    });
    return { data: rows, total: count, page, limit };
  }

  /**
   * Обновить игрока.
   * @param {number} id
   * @param {object} attrs
   */
  static async update(id, attrs) {
    return statDb.sequelize.transaction(async (t) => {
      const player = await statDb.Player.findByPk(id, { transaction: t });
      if (!player) {
        throw new Error('Игрок не найден');
      }

      attrs.date_update = new Date();
      await player.update(attrs, { transaction: t });
      return player;
    });
  }

  /**
   * "Удаление" — ставим object_status = deleted
   */
  static async remove(id) {
    return statDb.Player.update(
      { object_status: 'archive', date_update: new Date() },
      { where: { id } }
    );
  }
}

module.exports = PlayerService;
