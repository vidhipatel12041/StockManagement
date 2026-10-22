const { body, validationResult } = require('express-validator');

const validateProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('barcode').trim().notEmpty().withMessage('Barcode is required'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('color').trim().notEmpty().withMessage('Color is required'),
  body('size').trim().notEmpty().withMessage('Size is required'),
  body('mrp').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('MRP must be a positive number'),
  body('purchasePrice').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Purchase price must be a positive number'),
  body('sellingPrice').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Selling price must be a positive number'),
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

module.exports = { validateProduct };
