const { Op } = require('sequelize');

const statDb = require('../models/stat');
const mainDb = require('../models/main');

const FileService = require('./fileService');

console.debug('[RefereeService:init] mainDb models =', Object.keys(mainDb));
console.debug('[RefereeService:init] statDb models  =', Object.keys(statDb));
console.debug(
  '[RefereeService:init] RefereeGameConfirmation model type =',
  typeof mainDb.RefereeGameConfirmation
);

async function logoUrl(club) {
  if (!club || !club.logo_id) {
    return null;
  }
  try {
    return await FileService.url(
      club.logo_id,
      (club.logo && club.logo.module) || 'clubLogo',
      (club.logo && club.logo.name) || ''
    );
  } catch {
    return null;
  }
}

class RefereeService {
  static async _refereeIdsForUser(userId) {
    const pairs = await mainDb.UserReferee.findAll({
      where: { user_id: userId },
      attributes: ['referee_id'],
    });
    console.debug(
      '[RefereeService:_refereeIdsForUser] userId=%s -> refereeIds=%o',
      userId,
      pairs.map((r) => r.referee_id)
    );
    return pairs.map((r) => r.referee_id);
  }

  /**
   * Список игр, назначенных всем судьям текущего пользователя.
   * @param {Object} opts
   * @param {number} opts.userId        – ID пользователя (таблица user)
   * @param {number} [opts.page=1]      – номер страницы
   * @param {number} [opts.limit=20]    – размер страницы
   * @returns {Promise<{ rows:Array, count:number }>}
   */
  static async listForUser({ userId, page = 1, limit = 20 } = {}) {
    console.debug('[RefereeService:listForUser] args:', {
      userId,
      page,
      limit,
    });
    // получаем список referee_id, связанных с пользователем
    const refereeIds = await this._refereeIdsForUser(userId);
    console.debug('[listForUser] refereeIds fetched:', refereeIds);
    /* DEBUG */
    console.debug('[listForUser] userId=%s refereeIds=%o', userId, refereeIds);
    if (!refereeIds.length) {
      return { rows: [], count: 0 };
    }

    const offset = (page - 1) * limit;

    const { rows: games, count } = await statDb.Game.findAndCountAll({
      where: { object_status: { [Op.not]: 'deleted' } },
      limit,
      offset,
      order: [['date_start', 'DESC']],
      include: [
        {
          model: statDb.Referee,
          as: 'referees',
          attributes: [],
          through: { attributes: [] },
          where: { id: { [Op.in]: refereeIds } },
        },
        {
          model: statDb.Team,
          as: 'team1',
          attributes: ['id', 'short_name', 'club_id'],
          include: [
            {
              model: statDb.Club,
              as: 'club',
              attributes: ['id', 'logo_id'],
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
        {
          model: statDb.Team,
          as: 'team2',
          attributes: ['id', 'short_name', 'club_id'],
          include: [
            {
              model: statDb.Club,
              as: 'club',
              attributes: ['id', 'logo_id'],
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
        {
          model: statDb.Stadium,
          as: 'stadium',
          attributes: ['id', 'name'],
          include: [
            { model: statDb.City, as: 'city', attributes: ['id', 'name'] },
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
      ],
    });
    console.debug(
      '[listForUser] games fetched count=%d (offset=%d)',
      games.length,
      offset
    );
    /* DEBUG */
    console.debug('[listForUser] fetched games=%d', games.length);

    /* подтверждения текущего пользователя */
    const confirmations = await mainDb.RefereeGameConfirmation.findAll({
      where: {
        referee_id: { [Op.in]: refereeIds },
        game_id: { [Op.in]: games.map((g) => g.id) },
      },
      attributes: ['referee_id', 'game_id'],
    });
    console.debug(
      '[listForUser] confirmations fetched=%d — model available=%s',
      confirmations.length,
      Boolean(mainDb.RefereeGameConfirmation)
    );
    const confirmedSet = new Set(
      confirmations.map((c) => `${c.referee_id}:${c.game_id}`)
    );

    /* формируем DTO */
    const rows = await Promise.all(
      games.map(async (g) => {
        const plain = g.get({ plain: true });
        const team1Club = plain.team1?.club;
        const team2Club = plain.team2?.club;

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
            logo_url: await logoUrl(team1Club),
          },
          team2: {
            id: plain.team2?.id,
            name: plain.team2?.short_name,
            logo_url: await logoUrl(team2Club),
          },
          stadium: plain.stadium
            ? { id: plain.stadium.id, name: plain.stadium.name?.trim() }
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
          confirmed: refereeIds.some((rid) =>
            confirmedSet.has(`${rid}:${plain.id}`)
          ),
        };
      })
    );

    return { rows, count };
  }

  /**
   * @deprecated Use listForUser instead.
   */
  static async listForReferee({ refereeId, page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;

    // игры с участием конкретного судьи
    const { rows: games, count } = await statDb.Game.findAndCountAll({
      where: { object_status: { [Op.not]: 'deleted' } },
      limit,
      offset,
      order: [['date_start', 'DESC']],
      include: [
        {
          model: statDb.Referee,
          as: 'referees',
          attributes: [],
          through: { attributes: [] },
          where: { id: refereeId },
        },
        {
          model: statDb.Team,
          as: 'team1',
          attributes: ['id', 'short_name', 'club_id'],
          include: [
            {
              model: statDb.Club,
              as: 'club',
              attributes: ['id', 'logo_id'],
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
        {
          model: statDb.Team,
          as: 'team2',
          attributes: ['id', 'short_name', 'club_id'],
          include: [
            {
              model: statDb.Club,
              as: 'club',
              attributes: ['id', 'logo_id'],
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
        {
          model: statDb.Stadium,
          as: 'stadium',
          attributes: ['id', 'name'],
          include: [
            { model: statDb.City, as: 'city', attributes: ['id', 'name'] },
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
      ],
    });

    // подтверждения конкретного судьи
    const confirmations = await mainDb.RefereeGameConfirmation.findAll({
      where: {
        referee_id: refereeId,
        game_id: { [Op.in]: games.map((g) => g.id) },
      },
      attributes: ['game_id'],
    });
    const confirmedIds = new Set(confirmations.map((c) => c.game_id));

    // приводим к DTO
    const rows = await Promise.all(
      games.map(async (g) => {
        const plain = g.get({ plain: true });
        const team1Club = plain.team1?.club;
        const team2Club = plain.team2?.club;

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
            logo_url: await logoUrl(team1Club),
          },
          team2: {
            id: plain.team2?.id,
            name: plain.team2?.short_name,
            logo_url: await logoUrl(team2Club),
          },
          stadium: plain.stadium
            ? { id: plain.stadium.id, name: plain.stadium.name?.trim() }
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
          confirmed: confirmedIds.has(plain.id),
        };
      })
    );

    return { rows, count };
  }

  static async confirm(userId, gameId, yes = true) {
    console.debug(
      '[RefereeService:confirm] userId=%s gameId=%s yes=%s',
      userId,
      gameId,
      yes
    );
    const refereeIds = await this._refereeIdsForUser(userId);
    if (!refereeIds.length) {
      return;
    }

    return mainDb.sequelize.transaction(async (t) => {
      for (const rid of refereeIds) {
        const where = { referee_id: rid, game_id: gameId, user_id: userId };
        const existing = await mainDb.RefereeGameConfirmation.findOne({
          where,
          transaction: t,
        });
        console.debug('[confirm] rid=%s existing=%s', rid, Boolean(existing));

        if (yes && !existing) {
          await mainDb.RefereeGameConfirmation.create(where, {
            transaction: t,
          });
        } else if (!yes && existing) {
          await existing.destroy({ transaction: t });
        }
      }
    });
  }

  static async syncAssignments(userId) {
    console.debug('[RefereeService:syncAssignments] userId=%s', userId);
    const refereeIds = await this._refereeIdsForUser(userId);
    if (!refereeIds.length) {
      return;
    }

    const confirmations = await mainDb.RefereeGameConfirmation.findAll({
      where: { referee_id: { [Op.in]: refereeIds } },
      include: [
        {
          model: statDb.Game,
          as: 'game',
          attributes: ['id', 'date_update'],
        },
      ],
    });
    console.debug(
      '[syncAssignments] confirmations to check=%d',
      confirmations.length
    );

    for (const conf of confirmations) {
      const updatedAt = conf.game?.date_update;
      if (updatedAt && new Date(updatedAt) > conf.updated_at) {
        await conf.destroy();
      }
    }
  }
}

module.exports = RefereeService;
