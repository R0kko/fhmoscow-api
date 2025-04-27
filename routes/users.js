import { Router } from 'express';
import { validationResult } from 'express-validator';

import authMiddleware from '../middlewares/authMiddleware.js';
import {
  getMe,
  updateMe,
  changePassword,
} from '../controllers/userController.js';
import {
  passwordValidators,
  updateValidators,
} from '../validators/userValidators.js';

const router = Router();

/**
 * @swagger
 * /users/profile/me:
 *   get:
 *     summary: Получить данные текущего пользователя
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/profile/me', authMiddleware, getMe);

/**
 * @swagger
 * /users/profile/me:
 *   put:
 *     summary: Обновить профиль пользователя
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Профиль обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
  '/profile/me',
  authMiddleware,
  updateValidators,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: 'Некорректные данные', errors: errors.array() });
    }
    return updateMe(req, res, next);
  }
);

/**
 * @swagger
 * /users/profile/me/password:
 *   patch:
 *     summary: Сменить пароль
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [old_password, new_password]
 *             properties:
 *               old_password:
 *                 type: string
 *                 format: password
 *                 example: oldPass12
 *               new_password:
 *                 type: string
 *                 format: password
 *                 example: newPass34
 *     responses:
 *       200:
 *         description: Пароль обновлён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Пароль обновлён
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch(
  '/profile/me/password',
  authMiddleware,
  passwordValidators,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: 'Некорректные данные', errors: errors.array() });
    }
    return changePassword(req, res, next);
  }
);

export default router;
