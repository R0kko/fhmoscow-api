const express = require('express');
const { validationResult } = require('express-validator');

const router = express.Router();

const logger = require('../utils/logger');
const { loginValidators } = require('../validators/authValidators');
const { login } = require('../controllers/authController');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     description: Возвращает JWT‑токен и объект пользователя при успешной проверке логина/пароля.
 *     tags: [Авторизация]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "79001234567"
 *                 description: Номер телефона (только цифры, 10‑15 символов)
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "qwerty123"
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT‑токен для последующих запросов
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     email:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     middle_name:
 *                       type: string
 *                       nullable: true
 *                     date_of_birth:
 *                       type: string
 *                       format: date
 *                       nullable: true
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name: { type: string }
 *                           alias: { type: string }
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Неверный номер телефона или пароль
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Неверный номер телефона или пароль
 * */
router.post('/login', loginValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = errors.array({ onlyFirstError: true });
    logger.warn('Ошибка валидации запроса на логин:', validationErrors);
    return res.status(400).json({
      message: 'Некорректные входные данные',
      errors: validationErrors,
    });
  }
  return login(req, res);
});

module.exports = router;
