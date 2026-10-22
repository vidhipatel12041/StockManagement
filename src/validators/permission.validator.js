const { body, validationResult } = require('express-validator');

const validatePermission = [
  body('name').trim().notEmpty().withMessage('Permission name is required'),
  body('key').trim().notEmpty().withMessage('Permission key is required'),
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

module.exports = { validatePermission };
