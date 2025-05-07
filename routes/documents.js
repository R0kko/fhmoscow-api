import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import {
  listDocuments,
  updateDocumentMeta,
} from '../controllers/documentController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Управление базовыми документами
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DocumentRow:
 *       type: object
 *       properties:
 *         id:   { type: integer }
 *         name: { type: string }
 *         url:
 *           type: string
 *           format: uri
 *         category:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:   { type: integer }
 *             name: { type: string }
 *         season:
 *           allOf: [ $ref: '#/components/schemas/DocumentRow/properties/category' ]
 *         tournament:
 *           allOf: [ $ref: '#/components/schemas/DocumentRow/properties/category' ]
 */

/**
 * @swagger
 * /documents:
 *   get:
 *     summary: Список документов
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema: { type: integer }
 *       - in: query
 *         name: seasonId
 *         schema: { type: integer }
 *       - in: query
 *         name: tournamentId
 *         schema: { type: integer }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/DocumentRow' }
 *                 total: { type: integer }
 *                 page:  { type: integer }
 *                 limit: { type: integer }
 */

/**
 * @swagger
 * /documents/{id}:
 *   patch:
 *     summary: Обновить категорию / сезон документа
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId: { type: integer, nullable: true }
 *               seasonId:   { type: integer, nullable: true }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204: { description: Updated }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 */
router.get('/', listDocuments);
router.patch('/:id', authMiddleware, updateDocumentMeta);

export default router;
