import jwt from 'jsonwebtoken';

import logger from '../utils/logger.js';

export default function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const [, token] = auth.split(' ');

  if (!token) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    req.user = typeof decoded === 'string' ? { id: decoded } : decoded;
    next();
  } catch (err) {
    logger.error(`JWT error: ${err.message}`);
    return res.status(401).json({ message: 'Неверный или истекший токен' });
  }
}
