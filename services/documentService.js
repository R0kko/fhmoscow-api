'use strict';

const { Op } = require('sequelize');

const statDb = require('../models/stat');

const FileService = require('./fileService');

/**
 * Возвращает URL для файла документа.
 * @param {object|null} file
 */
async function fileUrl(file) {
  if (!file) {
    return null;
  }
  try {
    return await FileService.url(
      file.id,
      'contentDocumentFile',
      file.name || ''
    );
  } catch {
    return null;
  }
}

class DocumentService {
  /**
   * Список документов с фильтрами и пагинацией.
   * @param {Object} opts
   * @param {number} [opts.categoryId]
   * @param {number} [opts.seasonId]
   * @param {number} [opts.tournamentId]
   * @param {number} [opts.page=1]
   * @param {number} [opts.limit=20]
   */
  static async list({
    categoryId,
    seasonId,
    tournamentId,
    page = 1,
    limit = 20,
  } = {}) {
    const where = { object_status: { [Op.in]: ['new', 'active'] } };
    if (categoryId) {
      where.category_id = categoryId;
    }
    if (seasonId) {
      where.season_id = seasonId;
    }
    if (tournamentId) {
      where.tournament_id = tournamentId;
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await statDb.BasicDocument.findAndCountAll({
      where,
      limit,
      offset,
      order: [
        ['rang', 'ASC'],
        ['id', 'DESC'],
      ],
      include: [
        {
          model: statDb.BasicDocumentCategory,
          as: 'category',
          attributes: ['id', 'name'],
        },
        {
          model: statDb.Season,
          as: 'season',
          attributes: ['id', 'name'],
        },
        {
          model: statDb.Tournament,
          as: 'tournament',
          attributes: ['id', 'short_name'],
        },
        {
          model: statDb.File,
          as: 'file',
          attributes: ['id', 'module', 'name'],
        },
      ],
    });

    const data = await Promise.all(
      rows.map(async (doc) => {
        const d = doc.get({ plain: true });
        return {
          id: d.id,
          name: d.name,
          url: await fileUrl(d.file),
          category: d.category
            ? { id: d.category.id, name: d.category.name }
            : null,
          season: d.season ? { id: d.season.id, name: d.season.name } : null,
          tournament: d.tournament
            ? { id: d.tournament.id, name: d.tournament.short_name }
            : null,
        };
      })
    );

    return { data, total: count, page, limit };
  }

  /**
   * Обновить категорию и/или сезон документа.
   * @param {number} id  – document id
   * @param {{categoryId?: number, seasonId?: number}} payload
   */
  static async updateMeta(id, { categoryId, seasonId } = {}) {
    const doc = await statDb.BasicDocument.findByPk(id);
    if (!doc) {
      throw new Error('Document not found');
    }

    if (typeof categoryId !== 'undefined') {
      doc.category_id = categoryId;
    }
    if (typeof seasonId !== 'undefined') {
      doc.season_id = seasonId;
    }

    await doc.save({ fields: ['category_id', 'season_id'] });
    return doc.id;
  }
}

module.exports = DocumentService;
