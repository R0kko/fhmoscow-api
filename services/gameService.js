const { Op } = require('sequelize');

const statDb = require('../models/stat');

const FileService = require('./fileService');

async function fileUrl(file, fallbackModule = 'clubLogo') {
  if (!file) {
    return null;
  }
  try {
    const modulePath =
      file.module === 'staffPhoto'
        ? 'personStaffPhoto'
        : file.module || fallbackModule;
    const url = await FileService.url(file.id, modulePath, file.name || '');
    return typeof url === 'string' ? url : String(url);
  } catch {
    return null;
  }
}

class GameService {
  /**
   * Список матчей
   * @param {Object} opts
   * @param {string} [opts.dateFrom]   – ISO‑дата начала (включительно)
   * @param {string} [opts.dateTo]     – ISO‑дата конца   (включительно)
   * @param {number} [opts.status]     – фильтр по статусу
   * @param {number} [opts.teamId]     – ID одной из команд
   * @param {number} [opts.stadiumId]  – ID стадиона
   * @param {number} [opts.page=1]
   * @param {number} [opts.limit=20]
   * @returns {Promise<{data,total,page,limit}>}
   */
  static async list({
    dateFrom,
    dateTo,
    status,
    teamId,
    stadiumId,
    page = 1,
    limit = 20,
  } = {}) {
    const offset = (page - 1) * limit;

    const where = {};
    where.object_status = { [Op.in]: ['new', 'active'] };

    if (dateFrom) {
      where.date_start = {
        ...(where.date_start || {}),
        [Op.gte]: new Date(dateFrom),
      };
    }
    if (dateTo) {
      where.date_start = {
        ...(where.date_start || {}),
        [Op.lte]: new Date(dateTo),
      };
    }
    if (typeof status !== 'undefined') {
      where.status = status;
    }
    if (stadiumId) {
      where.stadium_id = stadiumId;
    }
    if (teamId) {
      where[Op.or] = [{ team1_id: teamId }, { team2_id: teamId }];
    }

    const { rows, count } = await statDb.Game.findAndCountAll({
      where,
      limit,
      offset,
      order: [['date_start', 'DESC']],
      include: [
        // Команды
        {
          model: statDb.Team,
          as: 'team1',
          attributes: ['id', 'short_name'],
          include: [
            {
              model: statDb.Club,
              as: 'club',
              attributes: ['id'], // keep at least one column so nested include works
              include: [
                {
                  model: statDb.File,
                  as: 'logo',
                  attributes: ['id', 'module', 'name'],
                  required: false,
                },
              ],
            },
          ],
        },
        {
          model: statDb.Team,
          as: 'team2',
          attributes: ['id', 'short_name'],
          include: [
            {
              model: statDb.Club,
              as: 'club',
              attributes: ['id'], // keep at least one column so nested include works
              include: [
                {
                  model: statDb.File,
                  as: 'logo',
                  attributes: ['id', 'module', 'name'],
                  required: false,
                },
              ],
            },
          ],
        },
        // Тур + группа + турнир
        {
          model: statDb.Tour,
          as: 'tour',
          attributes: ['id', 'name'],
          include: [
            {
              model: statDb.Group,
              as: 'group',
              attributes: ['id', 'name'],
            },
            {
              model: statDb.Tournament,
              as: 'tournament',
              attributes: ['id', 'short_name'],
            },
          ],
        },
        // Стадион
        {
          model: statDb.Stadium,
          as: 'stadium',
          attributes: ['id', 'name'],
        },
      ],
    });

    const data = await Promise.all(
      rows.map(async (g) => {
        const plain = g.get({ plain: true });

        // команды
        const t1Logo = await fileUrl(plain.team1?.club?.logo ?? null);
        const t2Logo = await fileUrl(plain.team2?.club?.logo ?? null);

        return {
          id: plain.id,
          date_start: plain.date_start,
          status: plain.status,
          score: {
            team1: plain.score_team1,
            team2: plain.score_team2,
          },
          team1: {
            id: plain.team1?.id,
            name: plain.team1?.short_name,
            logo_url: t1Logo,
          },
          team2: {
            id: plain.team2?.id,
            name: plain.team2?.short_name,
            logo_url: t2Logo,
          },
          stadium: plain.stadium
            ? { id: plain.stadium.id, name: plain.stadium.name }
            : null,
          tournament: plain.tour?.tournament
            ? {
              id: plain.tour.tournament.id,
              name: plain.tour.tournament.short_name,
            }
            : null,
          group: plain.tour?.group
            ? { id: plain.tour.group.id, name: plain.tour.group.name }
            : null,
        };
      })
    );

    return { data, total: count, page, limit };
  }

  /**
   * Детальная информация об игре + события
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async getById(id) {
    const game = await statDb.Game.findOne({
      where: { id, object_status: { [Op.ne]: 'deleted' } },
      include: [
        {
          model: statDb.Team,
          as: 'team1',
          attributes: ['id', 'short_name'],
          include: [
            {
              model: statDb.Club,
              as: 'club',
              attributes: ['id'], // keep at least one column so nested include works
              include: [
                {
                  model: statDb.File,
                  as: 'logo',
                  attributes: ['id', 'module', 'name'],
                  required: false,
                },
              ],
            },
          ],
        },
        {
          model: statDb.Team,
          as: 'team2',
          attributes: ['id', 'short_name'],
          include: [
            {
              model: statDb.Club,
              as: 'club',
              attributes: ['id'], // keep at least one column so nested include works
              include: [
                {
                  model: statDb.File,
                  as: 'logo',
                  attributes: ['id', 'module', 'name'],
                  required: false,
                },
              ],
            },
          ],
        },
        { model: statDb.Stadium, as: 'stadium', attributes: ['id', 'name'] },
        {
          model: statDb.GameEvent,
          as: 'events',
          required: false,
          include: [
            {
              model: statDb.GameEventType,
              as: 'eventType',
              attributes: ['id', 'name'],
            },
            {
              model: statDb.Team,
              as: 'team',
              attributes: ['id', 'short_name'],
            },
            {
              model: statDb.Player,
              as: 'goalAuthor',
              attributes: ['id', 'surname', 'name'],
            },
            {
              model: statDb.Player,
              as: 'goalAssistant1',
              attributes: ['id', 'surname', 'name'],
            },
            {
              model: statDb.Player,
              as: 'goalAssistant2',
              attributes: ['id', 'surname', 'name'],
            },
            {
              model: statDb.Player,
              as: 'penaltyPlayer',
              attributes: ['id', 'surname', 'name'],
            },
            {
              model: statDb.Player,
              as: 'shootoutPlayer',
              attributes: ['id', 'surname', 'name'],
            },
            {
              model: statDb.PenaltyMinutes,
              as: 'penaltyMinutes',
              attributes: ['id', 'name'],
            },
            {
              model: statDb.GameViolation,
              as: 'penaltyViolation',
              attributes: ['id', 'name', 'full_name'],
            },
          ],
        },
      ],
    });

    if (!game) {
      return null;
    }
    const plain = game.get({ plain: true });

    const t1Logo = await fileUrl(plain.team1?.club?.logo ?? null);
    const t2Logo = await fileUrl(plain.team2?.club?.logo ?? null);

    const skipTypes = new Set([1, 3, 5, 6, 7]);

    const events = (plain.events || [])
      .filter((ev) => !skipTypes.has(ev.eventType?.id))
      .map((ev) => {
        const mappedTypeId = ev.eventType?.id === 8 ? 2 : ev.eventType?.id;
        const mappedTypeName =
          ev.eventType?.id === 8 &&
          plain.events.find((e) => e.eventType?.id === 2)?.eventType?.name
            ? plain.events.find((e) => e.eventType?.id === 2).eventType.name
            : ev.eventType?.name;

        return {
          id: ev.id,
          type_id: mappedTypeId,
          type: mappedTypeName,
          minute: ev.minute,
          second: ev.second,
          period: ev.period,
          team: ev.team ? { id: ev.team.id, name: ev.team.short_name } : null,

          goal_author: ev.goalAuthor
            ? {
              id: ev.goalAuthor.id,
              name: `${ev.goalAuthor.surname} ${ev.goalAuthor.name}`,
            }
            : null,
          assist1: ev.goalAssistant1
            ? {
              id: ev.goalAssistant1.id,
              name: `${ev.goalAssistant1.surname} ${ev.goalAssistant1.name}`,
            }
            : null,
          assist2: ev.goalAssistant2
            ? {
              id: ev.goalAssistant2.id,
              name: `${ev.goalAssistant2.surname} ${ev.goalAssistant2.name}`,
            }
            : null,

          shootout_player: ev.shootoutPlayer
            ? {
              id: ev.shootoutPlayer.id,
              name: `${ev.shootoutPlayer.surname} ${ev.shootoutPlayer.name}`,
            }
            : null,

          penalty_player: ev.penaltyPlayer
            ? {
              id: ev.penaltyPlayer.id,
              name: `${ev.penaltyPlayer.surname} ${ev.penaltyPlayer.name}`,
            }
            : null,

          penalty: ev.penaltyMinutes
            ? {
              id: ev.penaltyMinutes.id,
              name: ev.penaltyMinutes.name,
            }
            : null,

          violation: ev.penaltyViolation
            ? {
              id: ev.penaltyViolation.id,
              name: ev.penaltyViolation.name,
              full_name: ev.penaltyViolation.full_name,
            }
            : null,
        };
      });

    events.sort(
      (a, b) =>
        (a.period ?? 0) - (b.period ?? 0) ||
        (a.minute ?? 0) - (b.minute ?? 0) ||
        (a.second ?? 0) - (b.second ?? 0) ||
        a.id - b.id
    );

    return {
      id: plain.id,
      date_start: plain.date_start,
      status: plain.status,
      score: {
        team1: plain.score_team1,
        team2: plain.score_team2,
        shootout: {
          team1: plain.shootout_score_team1,
          team2: plain.shootout_score_team2,
        },
      },
      technical_defeat: plain.technical_defeat,
      broadcast: plain.broadcast,
      broadcast_alt: plain.broadcast2,
      team1: {
        id: plain.team1.id,
        name: plain.team1.short_name,
        logo_url: t1Logo,
      },
      team2: {
        id: plain.team2.id,
        name: plain.team2.short_name,
        logo_url: t2Logo,
      },
      stadium: plain.stadium
        ? { id: plain.stadium.id, name: plain.stadium.name }
        : null,
      events,
    };
  }
}

module.exports = GameService;
