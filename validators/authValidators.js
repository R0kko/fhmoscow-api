const { body } = require('express-validator');

const loginValidators = [
  body('phone')
    .exists({ checkFalsy: true }).withMessage('Номер телефона обязателен')
    .custom(value => {
      const strValue = String(value);
      if (!/^\d{10,15}$/.test(strValue)) {
        throw new Error('Номер телефона должен содержать от 10 до 15 цифр');
      }
      return true;
    }),
  body('password')
    .exists({ checkFalsy: true }).withMessage('Пароль обязателен')
    .isString().withMessage('Пароль должен быть строкой')
    .isLength({ min: 6 }).withMessage('Пароль должен быть не менее 6 символов')
];

module.exports = { loginValidators };