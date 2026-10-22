const express = require('express');
const router = express.Router();
const colorController = require('../controllers/color.controller');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { validateColor } = require('../validators/color.validator');

router.use(requireAuth);
router.get('/', requireRole('SuperAdmin','Admin'), colorController.listColors);
router.get('/create', requireRole('SuperAdmin','Admin'), colorController.showCreateColor);
router.post('/create', requireRole('SuperAdmin','Admin'), validateColor, colorController.createColor);
router.get('/:id/edit', requireRole('SuperAdmin','Admin'), colorController.showEditColor);
router.post('/:id/edit', requireRole('SuperAdmin','Admin'), validateColor, colorController.updateColor);
router.post('/:id/delete', requireRole('SuperAdmin','Admin'), colorController.deleteColor);

module.exports = router;
