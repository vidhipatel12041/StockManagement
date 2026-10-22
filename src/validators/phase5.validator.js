// Validators for Phase 5 - Transfers and Central Inventory

const { body, param, query, validationResult } = require('express-validator');

// Transfer creation validators
const validateTransferCreation = [
  body('fromBranch')
    .notEmpty().withMessage('Source branch is required')
    .isMongoId().withMessage('Invalid branch ID'),
  
  body('toBranch')
    .notEmpty().withMessage('Destination branch is required')
    .isMongoId().withMessage('Invalid branch ID')
    .custom((value, { req }) => {
      if (value === req.body.fromBranch) {
        throw new Error('Source and destination branches must be different');
      }
      return true;
    }),
  
  body('product')
    .notEmpty().withMessage('Product is required')
    .isMongoId().withMessage('Invalid product ID'),
  
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
];

// Transfer ID validators
const validateTransferId = [
  param('id')
    .isMongoId().withMessage('Invalid transfer ID')
];

// Barcode search validators
const validateBarcodeSearch = [
  query('barcode')
    .notEmpty().withMessage('Barcode is required')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Barcode must be between 2 and 100 characters')
];

// Notification ID validators
const validateNotificationId = [
  param('id')
    .isMongoId().withMessage('Invalid notification ID')
];

// Middleware to handle validation errors
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // For API responses
    if (req.accepts(['json', 'html']) === 'json' || req.is('application/json')) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array().map(err => ({
          field: err.path || err.param,
          message: err.msg
        }))
      });
    }
    
    // For form submissions - store the errors on the request object instead of req.flash which is not configured
    req.validationError = errors.array().map(err => err.msg).join(', ');
  }
  
  next();
}

module.exports = {
  validateTransferCreation,
  validateTransferId,
  validateBarcodeSearch,
  validateNotificationId,
  handleValidationErrors
};
