const { body, validationResult } = require('express-validator');

const validateRole = [
  body('name').trim().notEmpty().withMessage('Role name is required'),
  body('key').trim().notEmpty().withMessage('Role key is required'),
  body('permissions').optional().isArray().withMessage('Permissions must be an array'),
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

module.exports = { validateRole };
