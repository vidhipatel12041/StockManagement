const { body, validationResult } = require('express-validator');

const validateBranch = [
  body('code').trim().notEmpty().withMessage('Branch code is required'),
  body('name').trim().notEmpty().withMessage('Branch name is required'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Valid email is required'),
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

module.exports = { validateBranch };
