import joi from "joi";

const sessionSchema = joi.object({
  id: joi.string().uuid().required(),
  location: joi.string()
    .trim()
    .min(1)
    .max(200)
    .pattern(/^[a-zA-Z0-9\s\-\,\.\']+$/)
    .required()
    .messages({
      'string.empty': 'Location is required',
      'string.min': 'Location must not be empty',
      'string.max': 'Location must not exceed 200 characters',
      'string.pattern.base': 'Location can only contain letters, numbers, spaces, hyphens, commas, periods, and apostrophes'
    }),
  date: joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'Date must be in YYYY-MM-DD format',
      'any.required': 'Date is required'
    }),
  kite: joi.string()
    .trim()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z0-9\s\-\.]+$/)
    .required()
    .messages({
      'string.empty': 'Kite is required',
      'string.min': 'Kite must not be empty',
      'string.max': 'Kite must not exceed 100 characters',
      'string.pattern.base': 'Kite name can only contain letters, numbers, spaces, hyphens, and periods'
    }),
  board: joi.string()
    .trim()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z0-9\s\-\.]+$/)
    .required()
    .messages({
      'string.empty': 'Board is required',
      'string.min': 'Board must not be empty',
      'string.max': 'Board must not exceed 100 characters',
      'string.pattern.base': 'Board name can only contain letters, numbers, spaces, hyphens, and periods'
    }),
  session_type: joi.string()
    .valid('Freeride', 'Freestyle', 'Big Air', 'Wave')
    .required()
    .messages({
      'string.empty': 'Session type is required',
      'any.only': 'Session type must be one of: Freeride, Freestyle, Big Air, Wave',
      'any.required': 'Session type is required'
    }),
  duration: joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional()
    .messages({
      'string.pattern.base': 'Duration must be in HH:MM format'
    }),
  max_jump: joi.number()
    .min(0)
    .max(100)
    .precision(1)
    .optional()
    .messages({
      'number.min': 'Max jump must be a positive number',
      'number.max': 'Max jump must not exceed 100 meters',
      'number.base': 'Max jump must be a number'
    }),
  wind_direction: joi.string()
    .valid('On Shore', 'Cross Shore', 'Cross On', 'Cross Off', 'Off Shore')
    .optional()
    .allow('')
    .messages({
      'any.only': 'Wind direction must be one of: On Shore, Cross Shore, Cross On, Cross Off, Off Shore'
    }),
  wind_speed: joi.number()
    .min(0)
    .max(200)
    .precision(1)
    .optional()
    .messages({
      'number.base': 'Wind speed must be a number',
      'number.min': 'Wind speed must be positive',
      'number.max': 'Wind speed must not exceed 200'
    }),
  max_speed: joi.number()
    .min(0)
    .max(200)
    .precision(1)
    .optional()
    .messages({
      'number.base': 'Max speed must be a number',
      'number.min': 'Max speed must be positive',
      'number.max': 'Max speed must not exceed 200'
    }),
  max_jump_distance: joi.number()
    .min(0)
    .max(500)
    .precision(1)
    .optional()
    .messages({
      'number.base': 'Max jump distance must be a number',
      'number.min': 'Max jump distance must be positive',
      'number.max': 'Max jump distance must not exceed 500 meters'
    }),
  max_airtime: joi.number()
    .min(0)
    .max(60)
    .precision(1)
    .optional()
    .messages({
      'number.base': 'Max airtime must be a number',
      'number.min': 'Max airtime must be positive',
      'number.max': 'Max airtime must not exceed 60 seconds'
    }),
});

const updateSessionSchema = joi.object({
  id: joi.string().uuid().required(),
  user_id: joi.string().uuid().optional(),
  location: joi.string()
    .trim()
    .min(1)
    .max(200)
    .pattern(/^[a-zA-Z0-9\s\-\,\.\']+$/)
    .optional()
    .messages({
      'string.min': 'Location must not be empty',
      'string.max': 'Location must not exceed 200 characters',
      'string.pattern.base': 'Location can only contain letters, numbers, spaces, hyphens, commas, periods, and apostrophes'
    }),
  date: joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Date must be in YYYY-MM-DD format'
    }),
  kite: joi.string()
    .trim()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z0-9\s\-\.]+$/)
    .optional()
    .messages({
      'string.min': 'Kite must not be empty',
      'string.max': 'Kite must not exceed 100 characters',
      'string.pattern.base': 'Kite name can only contain letters, numbers, spaces, hyphens, and periods'
    }),
  board: joi.string()
    .trim()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z0-9\s\-\.]+$/)
    .optional()
    .messages({
      'string.min': 'Board must not be empty',
      'string.max': 'Board must not exceed 100 characters',
      'string.pattern.base': 'Board name can only contain letters, numbers, spaces, hyphens, and periods'
    }),
  session_type: joi.string()
    .valid('Freeride', 'Freestyle', 'Big Air', 'Wave')
    .optional()
    .messages({
      'any.only': 'Session type must be one of: Freeride, Freestyle, Big Air, Wave'
    }),
  duration: joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional()
    .messages({
      'string.pattern.base': 'Duration must be in HH:MM format'
    }),
  max_jump: joi.number()
    .min(0)
    .max(100)
    .precision(1)
    .optional()
    .messages({
      'number.min': 'Max jump must be a positive number',
      'number.max': 'Max jump must not exceed 100 meters',
      'number.base': 'Max jump must be a number'
    }),
  wind_direction: joi.string()
    .valid('On Shore', 'Cross Shore', 'Cross On', 'Cross Off', 'Off Shore')
    .optional()
    .allow('')
    .messages({
      'any.only': 'Wind direction must be one of: On Shore, Cross Shore, Cross On, Cross Off, Off Shore'
    }),
  wind_speed: joi.number()
    .min(0)
    .max(200)
    .precision(1)
    .optional()
    .messages({
      'number.base': 'Wind speed must be a number',
      'number.min': 'Wind speed must be positive',
      'number.max': 'Wind speed must not exceed 200'
    }),
  max_speed: joi.number()
    .min(0)
    .max(200)
    .precision(1)
    .optional()
    .messages({
      'number.base': 'Max speed must be a number',
      'number.min': 'Max speed must be positive',
      'number.max': 'Max speed must not exceed 200'
    }),
  max_jump_distance: joi.number()
    .min(0)
    .max(500)
    .precision(1)
    .optional()
    .messages({
      'number.base': 'Max jump distance must be a number',
      'number.min': 'Max jump distance must be positive',
      'number.max': 'Max jump distance must not exceed 500 meters'
    }),
  max_airtime: joi.number()
    .min(0)
    .max(60)
    .precision(1)
    .optional()
    .messages({
      'number.base': 'Max airtime must be a number',
      'number.min': 'Max airtime must be positive',
      'number.max': 'Max airtime must not exceed 60 seconds'
    }),
}).min(2); // At least id + one other field

export default sessionSchema;
export { updateSessionSchema };