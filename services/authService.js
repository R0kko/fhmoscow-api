const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'my_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

async function authenticateUser(phone, password) {
  const user = await User.findOne({ where: { phone } });
  if (!user) {
    throw new Error('Пользователь не найден');
  }
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new Error('Неверный пароль');
  }
  const token = jwt.sign(
    { id: user.id, phone: user.phone },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  return { user, token };
}

module.exports = { authenticateUser };