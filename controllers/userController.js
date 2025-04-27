import UserService from '../services/userService.js';

/**
 * GET /profile/me
 * Возвращает профиль текущего пользователя.
 */
export const getMe = async (req, res) => {
  try {
    const user = await UserService.getById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (err) {
    req.logger?.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

/**
 * PUT /profile/me
 * Обновление основного профиля (имя, телефон, дата рождения и т.п.).
 * Валидация входящих данных выполняется в роутере до вызова контроллера.
 */
export const updateMe = async (req, res) => {
  try {
    const user = await UserService.updateProfile(req.user.id, req.body);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (err) {
    req.logger?.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

/**
 * PATCH /profile/me/password
 * Смена пароля (нужен старый пароль).
 */
export const changePassword = async (req, res) => {
  try {
    const result = await UserService.updatePassword(
      req.user.id,
      req.body.old_password,
      req.body.new_password
    );

    if (!result.ok) {
      if (result.reason === 'not_found') {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      if (result.reason === 'wrong_password') {
        return res.status(400).json({ message: 'Неверный текущий пароль' });
      }
    }

    res.json({ message: 'Пароль обновлён' });
  } catch (err) {
    req.logger?.error(err);
    console.log(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
