const { body } = require('express-validator');

const passwordValidators = [
  body('old_password').isString().isLength({ min: 6 }),
  body('new_password').isString().isLength({ min: 6 }),
];

const updateValidators = [
  body('first_name').optional().isString().isLength({ min: 2 }),
  body('last_name').optional().isString().isLength({ min: 2 }),
  body('email').optional().isEmail(),
  body('phone')
    .optional()
    .matches(/^\d{10,15}$/),
  body('date_of_birth').optional().isISO8601().toDate(),
];

module.exports = { passwordValidators, updateValidators };
