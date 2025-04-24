const express = require('express');
const { validationResult } = require('express-validator');

const router = express.Router();
const { authenticateUser } = require('../services/authService');
const logger = require('../utils/logger');
const { loginValidators } = require('../validators/authValidators');

router.post('/login', loginValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Ошибка валидации запроса на логин:', errors.array());
    return res.status(400).json({ message: 'Некорректные входные данные' });
  }

  const { phone, password } = req.body;
  try {
    const { user, token } = await authenticateUser(phone, password);
    res.json({
      token,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        last_name: user.last_name,
        first_name: user.first_name
      }
    });
  } catch (error) {
    logger.error(`Ошибка авторизации для телефона ${phone}: ${error.message}`);
    res.status(401).json({ message: 'Неверный номер телефона или пароль' });
  }
});

module.exports = router;