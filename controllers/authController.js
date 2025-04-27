const logger = require('../utils/logger');
const { authenticateUser } = require('../services/authService');

/**
 * Обработчик POST /auth/login
 * На вход: phone, password (валидация происходит в роутере).
 * На выход: JWT‑токен и объект пользователя с ролями.
 */
async function login(req, res) {
  const { phone, password } = req.body;

  try {
    const { user, token } = await authenticateUser(phone, password);

    return res.json({
      token,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        last_name: user.last_name,
        first_name: user.first_name,
        middle_name: user.middle_name,
        date_of_birth: user.date_of_birth,
        roles: user.roles,
      },
    });
  } catch (error) {
    logger.error(`Auth error for ${phone}: ${error.message}`);
    return res
      .status(401)
      .json({ message: 'Неверный номер телефона или пароль' });
  }
}

module.exports = { login };
