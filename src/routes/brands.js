const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { validateBrand } = require('../validators/brand.validator');

router.use(requireAuth);
router.get('/', requireRole('SuperAdmin','Admin'), brandController.listBrands);
router.get('/create', requireRole('SuperAdmin','Admin'), brandController.showCreateBrand);
router.post('/create', requireRole('SuperAdmin','Admin'), validateBrand, brandController.createBrand);
router.get('/:id/edit', requireRole('SuperAdmin','Admin'), brandController.showEditBrand);
router.post('/:id/edit', requireRole('SuperAdmin','Admin'), validateBrand, brandController.updateBrand);
router.post('/:id/delete', requireRole('SuperAdmin','Admin'), brandController.deleteBrand);

module.exports = router;
