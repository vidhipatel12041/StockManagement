const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { validateInventoryTransaction } = require('../validators/inventory.validator');

router.use(requireAuth);
router.get('/', requireRole('SuperAdmin','Admin'), inventoryController.listStock);
router.get('/transactions', requireRole('SuperAdmin','Admin'), inventoryController.listTransactions);
router.get('/transactions/create', requireRole('SuperAdmin','Admin'), inventoryController.showCreateTransaction);
router.post('/transactions/create', requireRole('SuperAdmin','Admin'), validateInventoryTransaction, inventoryController.createTransaction);
router.get('/history', requireRole('SuperAdmin','Admin'), inventoryController.listHistory);
router.get('/engine', requireRole('SuperAdmin','Admin'), inventoryController.showInventoryEngine);
router.post('/engine', requireRole('SuperAdmin','Admin'), inventoryController.runInventoryEngine);

module.exports = router;
