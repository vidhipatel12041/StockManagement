const express = require('express');
const router = express.Router();
const centralController = require('../controllers/central.controller');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { 
  validateBarcodeSearch,
  handleValidationErrors 
} = require('../validators/phase5.validator');

router.use(requireAuth);

router.get('/', requireRole('SuperAdmin', 'Admin'), centralController.getCentralInventory);
router.get('/search', 
  requireRole('SuperAdmin', 'Admin'),
  centralController.searchBarcode
);
module.exports = router;