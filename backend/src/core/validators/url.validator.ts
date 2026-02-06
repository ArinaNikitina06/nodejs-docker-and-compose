import * as Joi from 'joi';

export const JoiUrlValidator = Joi.string()
  .pattern(
    /^https?:\/\/[^\s/$.?#].[^\s]*$/i
  )
  .messages({
    'string.pattern.base': 'Неверный формат ссылки',
    'string.empty': 'Ссылка обязательна',
  });
