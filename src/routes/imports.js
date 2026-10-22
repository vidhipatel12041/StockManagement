const express = require('express');
const multer = require('multer');
const router = express.Router();
const importController = require('../controllers/import.controller');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

router.use(requireAuth);
router.get('/', requireRole('SuperAdmin','Admin'), importController.showImportDashboard);
router.get('/stock', requireRole('SuperAdmin','Admin'), importController.showStockImport);
router.post('/stock', requireRole('SuperAdmin','Admin'), upload.single('file'), importController.handleStockImport);
router.get('/sales', requireRole('SuperAdmin','Admin'), importController.showSalesImport);
router.post('/sales', requireRole('SuperAdmin','Admin'), upload.single('file'), importController.handleSalesImport);

module.exports = router;
