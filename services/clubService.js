const { Op } = require('sequelize');

const statDb = require('../models/stat');

const FileService = require('./fileService');

/**
 * Получить URL логотипа клуба через FileService.
 * Возвращает `null`, если файл недоступен.
 */
async function resolveLogo(logo) {
  if (!logo) {
    return null;
  }

  try {
    const modulePath = logo.module || 'clubLogo';
    const url = await FileService.url(logo.id, modulePath, logo.name || '');
    return typeof url === 'string' ? url : String(url);
  } catch {
    return null;
  }
}

/**
 * Удаляем технические поля из результата.
 */
function stripClub(plain) {
  delete plain.date_create;
  delete plain.date_update;
  delete plain.object_status;
  delete plain.logo_id;
  delete plain.tags_id;
  return plain;
}

class ClubService {
  /**
   * Детальная информация о клубе + список команд.
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async getById(id) {
    const club = await statDb.Club.findOne({
      where: { id, object_status: { [Op.ne]: 'deleted' } },
      include: [
        {
          model: statDb.File,
          as: 'logo',
          attributes: ['id', 'module', 'name'],
        },
        {
          model: statDb.Team,
          as: 'teams',
          attributes: [
            'id',
            'short_name',
            'full_name',
            'year',
            'object_status',
          ],
          include: [
            {
              model: statDb.File,
              as: 'logo',
              attributes: ['id', 'module', 'name'],
            },
          ],
        },
      ],
    });

    if (!club) {
      return null;
    }

    const plain = club.get({ plain: true });
    plain.logo_url = await resolveLogo(plain.logo); // добавляем поле URL

    // отфильтровываем команды по статусу
    plain.teams = await Promise.all(
      plain.teams
        .filter((t) => ['new', 'active'].includes(t.object_status))
        .map(async (t) => {
          return {
            id: t.id,
            short_name: t.short_name,
            full_name: t.full_name,
            year: t.year,
            logo_url: await resolveLogo(t.logo),
          };
        })
    );

    return stripClub(plain);
  }

  /**
   * Список клубов с пагинацией.
   * Возвращает только id, short_name и logo‑URL.
   *
   * @param {object} opts
   *   - page  {number} (default 1)
   *   - limit {number} (default 20)
   *   - search {string?} — фильтр по части short_name / full_name
   *   - isMoscow {boolean?} — фильтр по Москве
   * @returns {Promise<{data,total,page,limit}>}
   */
  static async list({ page = 1, limit = 20, search, isMoscow } = {}) {
    const offset = (page - 1) * limit;

    const where = { object_status: { [Op.in]: ['new', 'active'] } };
    if (typeof isMoscow === 'boolean') {
      where.is_moscow = isMoscow;
    }
    if (search) {
      where[Op.or] = [
        { short_name: { [Op.like]: `%${search}%` } },
        { full_name: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows, count } = await statDb.Club.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
      include: [
        {
          model: statDb.File,
          as: 'logo',
          attributes: ['id', 'module', 'name'],
        },
      ],
    });

    const data = await Promise.all(
      rows.map(async (r) => {
        const plain = r.get({ plain: true });
        return {
          id: plain.id,
          short_name: plain.short_name,
          logo: await resolveLogo(plain.logo),
        };
      })
    );

    return { data, total: count, page, limit };
  }

  /**
   * Обновить клуб (только для админ‑панели).
   * @param {number} id
   * @param {object} attrs
   */
  static async update(id, attrs) {
    return statDb.sequelize.transaction(async (t) => {
      const club = await statDb.Club.findByPk(id, { transaction: t });
      if (!club) {
        throw new Error('Клуб не найден');
      }

      attrs.date_update = new Date();

      await club.update(attrs, { transaction: t });
      return club.get({ plain: true });
    });
  }
}

module.exports = ClubService;
