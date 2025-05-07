import { query, param, body, validationResult } from 'express-validator';

import DocumentService from '../services/documentService.js';
import logger from '../utils/logger.js';

/**
 * GET /documents
 * ?categoryId=&seasonId=&tournamentId=&page=&limit=
 *
 * Список документов.
 */
export const listDocuments = [
  query('categoryId').optional().isInt({ min: 1 }).toInt(),
  query('seasonId').optional().isInt({ min: 1 }).toInt(),
  query('tournamentId').optional().isInt({ min: 1 }).toInt(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      categoryId,
      seasonId,
      tournamentId,
      page = 1,
      limit = 20,
    } = req.query;

    try {
      const resp = await DocumentService.list({
        categoryId,
        seasonId,
        tournamentId,
        page,
        limit,
      });
      res.json(resp);
    } catch (err) {
      logger.error(`listDocuments error: ${err.message}`);
      res
        .status(500)
        .json({ message: 'Не удалось получить список документов' });
    }
  },
];

/**
 * PATCH /documents/:id
 * { categoryId, seasonId }
 *
 * Обновить сезон и/или категорию документа.
 */
export const updateDocumentMeta = [
  param('id').isInt({ min: 1 }).toInt(),
  body('categoryId').optional({ nullable: true }).isInt({ min: 1 }),
  body('seasonId').optional({ nullable: true }).isInt({ min: 1 }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = Number(req.params.id);
    const { categoryId, seasonId } = req.body;

    try {
      await DocumentService.updateMeta(id, { categoryId, seasonId });
      res.status(204).end();
    } catch (err) {
      logger.error(`updateDocumentMeta error: ${err.message}`);
      res
        .status(500)
        .json({ message: 'Не удалось обновить метаданные документа' });
    }
  },
];
