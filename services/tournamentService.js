const statDb = require('../models/stat');
const {
  validateTournamentUpdate,
} = require('../validators/tournamentValidators');

const FileService = require('./fileService');

async function sanitizeTournament(plain) {
  if (plain.season && plain.season.name) {
    plain.season = plain.season.name;
  } else {
    plain.season = null;
  }

  if (plain.type && plain.type.short_name) {
    plain.type = plain.type.short_name;
  } else {
    plain.type = null;
  }

  if (plain.logo && plain.logo.id) {
    const modulePath = plain.logo.module || 'tournamentLogo';
    try {
      plain.logo = await FileService.url(
        plain.logo.id,
        modulePath,
        plain.logo.name || ''
      );
      if (typeof plain.logo !== 'string') {
        plain.logo = String(plain.logo);
      }
      if (typeof plain.logo === 'string') {
        plain.logo = plain.logo.replace(/\.jpeg$/i, '.jpg');
      }
    } catch {
      delete plain.logo;
    }
  }

  if (plain.logo && typeof plain.logo !== 'string') {
    delete plain.logo;
  }

  [
    'type_id',
    'season_id',
    'date_create',
    'date_update',
    'object_status',
    'hide_in_main_calendar',
    'logo_id',
    'tags_id',
  ].forEach((k) => delete plain[k]);

  return plain;
}

async function sanitizeTournamentDetail(plain) {
  plain = await sanitizeTournament(plain);

  delete plain.logo_id;
  delete plain.tags_id;

  return plain;
}

function sanitizeStage(stage) {
  const plain = stage.get ? stage.get({ plain: true }) : stage;
  return {
    id: plain.id,
    name: plain.name,
    current: !!plain.current,
  };
}

class TournamentService {
  /**
   * Список турниров (status = active).
   * @param {Object} opts
   * @param {number} [opts.seasonId]      – фильтр по сезону
   * @param {number} [opts.yearOfBirth]   – фильтр «год рождения»
   * @param {number} [opts.page=1]
   * @param {number} [opts.limit=20]
   * @returns {{data: object[], page: number, total: number}}
   */
  static async list(opts = {}) {
    const page = Math.max(Number(opts.page) || 1, 1);
    const limit = Math.max(Number(opts.limit) || 20, 1);
    const offset = (page - 1) * limit;

    const where = { object_status: 'active' };
    if (opts.seasonId) {
      where.season_id = opts.seasonId;
    }
    if (opts.yearOfBirth) {
      where.year_of_birth = opts.yearOfBirth;
    }

    const { Tournament, TournamentType, Season, File } = statDb;
    const { rows, count } = await Tournament.findAndCountAll({
      where,
      limit,
      offset,
      order: [['date_start', 'DESC']],
      include: [
        {
          model: TournamentType,
          as: 'type',
          attributes: ['id', 'full_name', 'short_name'],
        },
        { model: Season, as: 'season', attributes: ['id', 'name'] },
        {
          model: File,
          as: 'logo',
          attributes: ['id', 'module', 'name', 'mime_type'],
        },
      ],
    });

    const data = await Promise.all(
      rows.map(async (r) => await sanitizeTournament(r.get({ plain: true })))
    );
    return { data, page, total: count };
  }

  static async get(id) {
    const { Tournament, TournamentType, Season, File } = statDb;

    const record = await Tournament.findOne({
      where: { id, object_status: 'active' },
      include: [
        {
          model: TournamentType,
          as: 'type',
          attributes: ['id', 'full_name', 'short_name'],
        },
        { model: Season, as: 'season', attributes: ['id', 'name'] },
        {
          model: File,
          as: 'logo',
          attributes: ['id', 'module', 'name', 'mime_type'],
        },
        {
          model: statDb.Stage,
          as: 'stages',
          attributes: [
            'id',
            'name',
            'play_off',
            'current',
            'transition',
            'object_status',
          ],
          where: { object_status: ['new', 'active'] },
          required: false,
          separate: true,
          order: [['id', 'ASC']],
        },
      ],
    });

    if (!record) {
      throw new Error('Турнир не найден');
    }

    const plain = await sanitizeTournamentDetail(record.get({ plain: true }));
    if (record.stages) {
      plain.stages = record.stages.map(sanitizeStage);
    }
    return plain;
  }

  /**
   * Обновить разрешённые поля турнира (active only).
   * Возвращает plain‑object.
   */
  static async update(id, dto) {
    const { error, value: data } = validateTournamentUpdate(dto);
    if (error) {
      const err = new Error('Некорректные данные');
      err.details = error.details;
      throw err;
    }

    const { Tournament } = statDb;
    const record = await Tournament.findByPk(id);
    if (!record || record.object_status !== 'active') {
      throw new Error('Турнир не найден');
    }

    const allowed = [
      'full_name',
      'short_name',
      'date_start',
      'date_end',
      'year_of_birth',
      'hide_in_main_calendar',
    ];

    allowed.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(data, field)) {
        record[field] = data[field];
      }
    });

    record.date_update = new Date();
    await record.save();

    return record.get({ plain: true });
  }
}

module.exports = TournamentService;
