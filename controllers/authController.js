const logger = require('../utils/logger');
const { authenticateUser } = require('../services/authService');

/**
 * Обработчик POST /auth/login
 * На вход: phone, password (валидация происходит в роутере).
 * На выход: JWT‑токен и объект пользователя с ролями.
 */
async function login(req, res) {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: 'phone и password обязательны' });
  }

  const normalizedPhone = String(phone).replace(/\D+/g, '');
  const trimmedPassword = String(password).trim();

  try {
    const { user, token } = await authenticateUser(
      normalizedPhone,
      trimmedPassword
    );

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
    const masked = `${normalizedPhone.slice(0, 2)}******${normalizedPhone.slice(-2)}`;
    logger.error(`Auth error for ${masked}: ${error.message}`);

    return res
      .status(401)
      .json({ message: 'Неверный номер телефона или пароль' });
  }
}

module.exports = { login };
