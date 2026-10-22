const { body, validationResult } = require('express-validator');

const validateInventoryTransaction = [
  body('branch').trim().notEmpty().withMessage('Branch is required'),
  body('product').trim().notEmpty().withMessage('Product is required'),
  body('type').isIn(['in', 'out']).withMessage('Transaction type must be in or out'),
  body('quantity').trim().notEmpty().withMessage('Quantity is required').isFloat({ gt: 0 }).withMessage('Quantity must be greater than zero'),
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

module.exports = { validateInventoryTransaction };
