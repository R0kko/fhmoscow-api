const { Op } = require('sequelize');

const statDb = require('../models/stat');

const FileService = require('./fileService');

async function fileUrl(file) {
  if (!file) {
    return null;
  }
  try {
    // temporary mapping: staffPhoto → personStaffPhoto
    const modulePath =
      file.module === 'staffPhoto'
        ? 'personStaffPhoto'
        : file.module || 'clubLogo';
    const url = await FileService.url(file.id, modulePath, file.name || '');
    return typeof url === 'string' ? url : String(url);
  } catch {
    return null;
  }
}

function stripDates(target) {
  delete target.date_create;
  delete target.date_update;
  delete target.object_status;
  return target;
}

class TeamService {
  /**
   * Детальная информация о команде + состав игроков и штаба
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async getById(id) {
    const team = await statDb.Team.findOne({
      where: { id, object_status: { [Op.ne]: 'deleted' } },
      include: [
        {
          model: statDb.Club,
          as: 'club',
          attributes: ['id'],
          include: [
            {
              model: statDb.File,
              as: 'logo',
              attributes: ['id', 'module', 'name'],
            },
          ],
        },
        // Player → many-to-one Team (предполагаем наличие team_id в player)
        {
          model: statDb.Player,
          as: 'players',
          attributes: [
            'id',
            'surname',
            'name',
            'patronymic',
            'date_of_birth',
            'object_status',
          ],
          where: { object_status: { [Op.in]: ['new', 'active'] } },
          required: false,
          include: [
            {
              model: statDb.File,
              as: 'photo',
              attributes: ['id', 'module', 'name'],
            },
          ],
        },
        {
          model: statDb.TeamStaff,
          as: 'teamStaff',
          where: { object_status: { [Op.in]: ['new', 'active'] } },
          required: false,
          include: [
            {
              model: statDb.Staff,
              as: 'staff',
              attributes: [
                'id',
                'surname',
                'name',
                'patronymic',
                'object_status',
              ],
              include: [
                {
                  model: statDb.File,
                  as: 'photo',
                  attributes: ['id', 'module', 'name'],
                },
              ],
            },
            {
              model: statDb.ClubStaff,
              as: 'contract',
              required: false,
              include: [
                {
                  model: statDb.StaffCategory,
                  as: 'category',
                  attributes: ['name'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!team) {
      return null;
    }

    const plain = team.get({ plain: true });
    const logoUrl = await fileUrl(plain.club?.logo);

    plain.players = await Promise.all(
      (plain.players || []).map(async (p) => {
        const photo = await fileUrl(p.photo);
        return {
          id: p.id,
          full_name: [p.surname, p.name, p.patronymic]
            .filter(Boolean)
            .join(' '),
          date_of_birth: p.date_of_birth,
          photo_url: photo,
        };
      })
    );

    plain.staff = await Promise.all(
      (plain.teamStaff || []).map(async (ts) => {
        const s = ts.staff || {};
        const photo = await fileUrl(s.photo);
        return {
          id: s.id,
          full_name: [s.surname, s.name, s.patronymic]
            .filter(Boolean)
            .join(' '),
          category: ts.contract?.category?.name || null,
          photo_url: photo,
        };
      })
    );

    delete plain.club;
    delete plain.teamStaff;

    plain.logo_url = logoUrl;

    return stripDates(plain);
  }

  /**
   * Список команд (id, short_name, logo_url) с пагинацией / поиском / годом
   */
  static async list({ page = 1, limit = 20, search, year } = {}) {
    const offset = (page - 1) * limit;

    const where = { object_status: { [Op.in]: ['new', 'active'] } };
    if (year) {
      where.year = year;
    }
    if (search) {
      where[Op.or] = [
        { short_name: { [Op.like]: `%${search}%` } },
        { full_name: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows, count } = await statDb.Team.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
      include: [
        {
          model: statDb.Club,
          as: 'club',
          attributes: ['id'],
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

    const data = await Promise.all(
      rows.map(async (r) => {
        const plain = r.get({ plain: true });
        return {
          id: plain.id,
          short_name: plain.short_name,
          logo_url: await fileUrl(plain.club?.logo),
        };
      })
    );

    return { data, total: count, page, limit };
  }
}

module.exports = TeamService;
