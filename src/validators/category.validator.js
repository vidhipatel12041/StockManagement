const { body, validationResult } = require('express-validator');

const validateCategory = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
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

module.exports = { validateCategory };
