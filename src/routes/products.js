const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { validateProduct } = require('../validators/product.validator');

router.use(requireAuth);
router.get('/', requireRole('SuperAdmin','Admin'), productController.listProducts);
router.get('/create', requireRole('SuperAdmin','Admin'), productController.showCreateProduct);
router.post('/create', requireRole('SuperAdmin','Admin'), validateProduct, productController.createProduct);
router.get('/:id/edit', requireRole('SuperAdmin','Admin'), productController.showEditProduct);
router.post('/:id/edit', requireRole('SuperAdmin','Admin'), validateProduct, productController.updateProduct);
router.post('/:id/delete', requireRole('SuperAdmin','Admin'), productController.deleteProduct);

module.exports = router;
