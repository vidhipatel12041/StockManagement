const express = require('express');
const router = express.Router();
const sizeController = require('../controllers/size.controller');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { validateSize } = require('../validators/size.validator');

router.use(requireAuth);
router.get('/', requireRole('SuperAdmin','Admin'), sizeController.listSizes);
router.get('/create', requireRole('SuperAdmin','Admin'), sizeController.showCreateSize);
router.post('/create', requireRole('SuperAdmin','Admin'), validateSize, sizeController.createSize);
router.get('/:id/edit', requireRole('SuperAdmin','Admin'), sizeController.showEditSize);
router.post('/:id/edit', requireRole('SuperAdmin','Admin'), validateSize, sizeController.updateSize);
router.post('/:id/delete', requireRole('SuperAdmin','Admin'), sizeController.deleteSize);

module.exports = router;
