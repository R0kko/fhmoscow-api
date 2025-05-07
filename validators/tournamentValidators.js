const Joi = require('joi');

/**
 * Схема обновления турнира
 * Разрешены только перечисленные поля.
 */
const updateSchema = Joi.object({
  full_name: Joi.string().min(4).max(255),
  short_name: Joi.string().min(2).max(255).allow(null, ''),
  date_start: Joi.date().iso(),
  date_end: Joi.date().iso().min(Joi.ref('date_start')),
  year_of_birth: Joi.number().integer().min(1900).max(new Date().getFullYear()),
  hide_in_main_calendar: Joi.boolean(),
})
  .min(1)
  .unknown(false)
  .messages({
    'object.unknown': 'Недопустимое поле: {{#label}}',
  });

/**
 * Проверка обновления турнира.
 * @param {object} dto
 * @returns {{error: Joi.Error | undefined, value: object}}
 */
function validateTournamentUpdate(dto) {
  return updateSchema.validate(dto, { abortEarly: false, stripUnknown: true });
}

module.exports = { validateTournamentUpdate };
