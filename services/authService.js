const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User, Role } = require('../models');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'my_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

async function authenticateUser(phone, password) {
  const user = await User.findOne({
    where: { phone },
    include: [
      {
        model: Role,
        attributes: ['name', 'alias'],
        through: { attributes: [] },
      },
    ],
  });
  if (!user) {
    throw new Error('Пользователь не найден');
  }
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new Error('Неверный пароль');
  }
  const token = jwt.sign({ id: user.id, phone: user.phone }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  const roles =
    user.Roles?.map((r) => ({ name: r.name, alias: r.alias })) || [];

  const userData = {
    id: user.id,
    phone: user.phone,
    email: user.email,
    last_name: user.last_name,
    first_name: user.first_name,
    middle_name: user.middle_name,
    date_of_birth: user.date_of_birth,
    roles,
  };

  return { user: userData, token };
}

module.exports = { authenticateUser };
