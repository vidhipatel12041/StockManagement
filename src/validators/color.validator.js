const { body, validationResult } = require('express-validator');

const validateColor = [
  body('name').trim().notEmpty().withMessage('Color name is required'),
  body('hexCode')
    .optional({ checkFalsy: true })
    .matches(/^#([0-9A-F]{3}|[0-9A-F]{6})$/i)
    .withMessage('Hex code must be a valid color code'),
  body('status').isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array().map((item) => item.msg).join(', '));
      error.status = 400;
      return next(error);
    }
    next();
  }
];

module.exports = { validateColor };
