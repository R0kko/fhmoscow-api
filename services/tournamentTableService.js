const { Op } = require('sequelize');

const statDb = require('../models/stat');

const FileService = require('./fileService');

/** Утилита: формируем прямую ссылку на логотип команды */
async function extractLogoUrl(team) {
  if (!team || !team.club || !team.club.logo) {
    return null;
  }

  try {
    const modulePath = team.club.logo.module || 'clubLogo';
    const url = await FileService.url(
      team.club.logo.id,
      modulePath,
      team.club.logo.name || ''
    );
    return typeof url === 'string' ? url : String(url);
  } catch {
    return null;
  }
}

class TournamentTableService {
  /**
   * Список позиций турнирной таблицы с пагинацией и фильтрами
   * @param {object} opts
   *   - stageId         {number?}  – фильтр по этапу (обязателен, если нет groupId)
   *   - groupId         {number?}  – фильтр по группе (обязателен, если нет stageId)
   *   - moscowStanding  {boolean}  – обязательный фильтр (true/false)
   *   - page            {number}   – default 1
   *   - limit           {number}   – default 50
   * @returns {Promise<{data,total,page,limit}>}
   */
  static async list({
    stageId,
    groupId,
    moscowStanding,
    page = 1,
    limit = 50,
  } = {}) {
    if (moscowStanding === undefined) {
      throw new Error('moscowStanding is required');
    }
    if (!stageId && !groupId) {
      throw new Error('stageId или groupId должен быть задан');
    }

    const offset = (page - 1) * limit;

    const where = {
      moscow_standings: moscowStanding,
    };
    if (stageId) {
      where.stage_id = stageId;
    }
    if (groupId) {
      where.tournament_group_id = groupId;
    }

    const { rows, count } = await statDb.TournamentTable.findAndCountAll({
      where,
      limit,
      offset,
      order: [['position', 'DESC']],
      include: [
        {
          model: statDb.Team,
          as: 'team',
          attributes: ['id', 'short_name', 'club_id'],
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
        },
      ],
    });

    const data = [];
    for (const r of rows) {
      const plain = r.get({ plain: true });
      const logoUrl = await extractLogoUrl(plain.team);

      data.push({
        team_id: plain.team.id,
        short_name: plain.team.short_name,
        logo: logoUrl,
        game_count: plain.game_count,
        win_count: plain.win_count,
        tie_count: plain.tie_count,
        loss_count: plain.loss_count,
        win_overtime_count: plain.win_overtime_count,
        lose_overtime_count: plain.lose_overtime_count,
        pucks_scored: plain.pucks_scored,
        pucks_missed: plain.pucks_missed,
        pucks_difference: plain.pucks_difference,
        score: plain.score,
        position: plain.position,
      });
    }

    return { data, total: count, page, limit };
  }

  /**
   * Одна позиция таблицы по id
   * @param {number} id
   */
  static async getById(id) {
    const row = await statDb.TournamentTable.findOne({
      where: {
        id,
        object_status: { [Op.ne]: 'deleted' },
      },
      include: [
        {
          model: statDb.Team,
          as: 'team',
          attributes: ['id', 'short_name', 'club_id'],
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
        },
      ],
    });

    if (!row) {
      return null;
    }

    const plain = row.get({ plain: true });
    return {
      team_id: plain.team.id,
      short_name: plain.team.short_name,
      logo: await extractLogoUrl(plain.team),
      game_count: plain.game_count,
      win_count: plain.win_count,
      tie_count: plain.tie_count,
      loss_count: plain.loss_count,
      win_overtime_count: plain.win_overtime_count,
      lose_overtime_count: plain.lose_overtime_count,
      pucks_scored: plain.pucks_scored,
      pucks_missed: plain.pucks_missed,
      pucks_difference: plain.pucks_difference,
      score: plain.score,
      position: plain.position,
    };
  }
}

module.exports = TournamentTableService;
