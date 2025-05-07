const { Op } = require('sequelize');

const statDb = require('../models/stat');

const FileService = require('./fileService');
const DadataService = require('./dadataService');

async function sanitizePlayer(plain) {
  if (plain.photo && plain.photo.id) {
    const modulePath = plain.photo.module || 'clubPlayerPhoto';
    try {
      plain.photo = await FileService.url(
        plain.photo.id,
        modulePath,
        plain.photo.name || ''
      );
      if (typeof plain.photo !== 'string') {
        plain.photo = String(plain.photo);
      }
    } catch {
      /* ignore */
    }
  } else if (plain.photo_id) {
    try {
      plain.photo = await FileService.url(plain.photo_id);
    } catch {
      /* ignore */
    }
  }

  delete plain.photo_url;
  if (plain.photo && typeof plain.photo !== 'string') {
    delete plain.photo;
  }

  delete plain.repeated;
  delete plain.reason_for_refusal;
  delete plain.date_create;
  delete plain.date_update;
  delete plain.object_status;
  delete plain.sex_id;
  delete plain.photo_id;

  plain.sex = plain.sex ? plain.sex.name : null;
  return plain;
}

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
          attributes: ['id', 'module', 'name', 'mime_type'],
        },
      ],
    });
    if (!player || !['new', 'active'].includes(player.object_status)) {
      return null;
    }

    const plain = player.get({ plain: true });

    return await sanitizePlayer(plain);
  }

  /**
   * Список игроков c пагинацией
   * @param {object} opts { page = 1, limit = 20, search }
   */
  static async list({ page = 1, limit = 20, search } = {}) {
    const offset = (page - 1) * limit;
    const where = {};
    where.object_status = { [Op.in]: ['new', 'active'] };
    let orderBy = [['id', 'DESC']];

    if (search) {
      const { col, fn, where: rawWhere, literal } = statDb.sequelize;
      const likeAll = (s) => `%${s}%`;

      let finalWhere;
      let relevanceCase;

      try {
        const cleaned = await DadataService.cleanName(search);
        if (cleaned && cleaned.qc === 0) {
          const { surname = '', name = '', patronymic = '' } = cleaned;
          finalWhere = {
            [Op.and]: [
              { surname: { [Op.like]: likeAll(surname) } },
              name ? { name: { [Op.like]: likeAll(name) } } : {},
              patronymic
                ? { patronymic: { [Op.like]: likeAll(patronymic) } }
                : {},
            ],
          };

          relevanceCase = literal(`CASE
            WHEN Player.surname = '${surname}' AND Player.name = '${name}' AND Player.patronymic = '${patronymic}' THEN 3
            WHEN Player.surname = '${surname}' AND Player.name = '${name}' THEN 2
            WHEN Player.surname = '${surname}' THEN 1
            ELSE 0 END`);
          orderBy = [
            [relevanceCase, 'DESC'],
            ['id', 'DESC'],
          ];
        }
      } catch {
        /* DaData недоступна — игнорируем */
      }

      if (!finalWhere) {
        const term = likeAll(search);
        finalWhere = {
          [Op.or]: [
            rawWhere(col('Player.surname'), { [Op.like]: term }),
            rawWhere(col('Player.name'), { [Op.like]: term }),
            rawWhere(col('Player.patronymic'), { [Op.like]: term }),
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
          ],
        };
      }
      Object.assign(where, finalWhere);
    }

    const { rows, count } = await statDb.Player.findAndCountAll({
      where,
      limit,
      offset,
      order: orderBy,
      include: [
        { model: statDb.Sex, as: 'sex', attributes: ['name'] },
        {
          model: statDb.File,
          as: 'photo',
          attributes: ['id', 'module', 'name', 'mime_type'],
        },
      ],
    });
    const data = await Promise.all(
      rows.map(async (r) => await sanitizePlayer(r.get({ plain: true })))
    );
    return { data, total: count, page, limit };
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

  static async getWithStats(id) {
    const player = await this.getById(id);
    if (!player) {
      return null;
    }

    const { fn, col } = statDb.sequelize;

    const rows = await statDb.PlayerStatistic.findAll({
      where: { player_id: id },
      attributes: [
        'team_id',
        [fn('COUNT', col('PlayerStatistic.id')), 'games'],
        [fn('SUM', col('goal')), 'goals'],
        [fn('SUM', col('assist')), 'assists'],
        [fn('SUM', col('penalty')), 'penalties'],
        [fn('SUM', col('missed')), 'missed'],
        [fn('AVG', col('reliability_factor')), 'reliability_factor'],
      ],
      group: ['team_id'],
      include: [
        {
          model: statDb.Team,
          as: 'team',
          attributes: ['id', 'short_name', 'full_name', 'club_id'],
          include: [
            {
              model: statDb.Club,
              as: 'club',
              attributes: ['id', 'short_name', 'full_name', 'logo_id'],
              include: [
                {
                  model: statDb.File,
                  as: 'logo',
                  attributes: ['id', 'module', 'name'],
                },
              ],
            },
          ],
        },
      ],
    });

    const statistics = await Promise.all(
      rows.map(async (r) => {
        const plain = r.get({ plain: true });

        const team = plain.team || {};
        const club = team.club || {};

        let logoUrl = null;
        if (club.logo && club.logo.id) {
          try {
            logoUrl = await FileService.url(
              club.logo.id,
              club.logo.module || 'clubLogo',
              club.logo.name || ''
            );
            if (typeof logoUrl !== 'string') {
              logoUrl = String(logoUrl);
            }
          } catch {
            /* empty */
          }
        }

        return {
          team_id: team.id,
          team_name: team.short_name || team.full_name,
          club_id: club.id,
          club_name: club.short_name || club.full_name,
          logo_url: logoUrl,
          games: Number(plain.games) || 0,
          goals: Number(plain.goals) || 0,
          assists: Number(plain.assists) || 0,
          penalties: Number(plain.penalties) || 0,
          missed: Number(plain.missed) || 0,
          reliability_factor:
            plain.reliability_factor !== null
              ? Number(parseFloat(plain.reliability_factor).toFixed(3))
              : null,
        };
      })
    );

    return {
      ...player,
      statistics,
    };
  }
}

module.exports = PlayerService;
