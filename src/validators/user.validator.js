const { body, validationResult } = require('express-validator');

const validateUser = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').optional({ checkFalsy: true }).isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isMongoId().withMessage('Valid role required'),
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

module.exports = { validateUser };
