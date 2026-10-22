const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { validateCategory } = require('../validators/category.validator');

router.use(requireAuth);
router.get('/', requireRole('SuperAdmin','Admin'), categoryController.listCategories);
router.get('/create', requireRole('SuperAdmin','Admin'), categoryController.showCreateCategory);
router.post('/create', requireRole('SuperAdmin','Admin'), validateCategory, categoryController.createCategory);
router.get('/:id/edit', requireRole('SuperAdmin','Admin'), categoryController.showEditCategory);
router.post('/:id/edit', requireRole('SuperAdmin','Admin'), validateCategory, categoryController.updateCategory);
router.post('/:id/delete', requireRole('SuperAdmin','Admin'), categoryController.deleteCategory);

module.exports = router;
