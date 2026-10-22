const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permission.controller');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { validatePermission } = require('../validators/permission.validator');

router.use(requireAuth);
router.get('/', requireRole('SuperAdmin'), permissionController.listPermissions);
router.get('/create', requireRole('SuperAdmin'), permissionController.showCreatePermission);
router.post('/create', requireRole('SuperAdmin'), validatePermission, permissionController.createPermission);
router.get('/:id/edit', requireRole('SuperAdmin'), permissionController.showEditPermission);
router.post('/:id/edit', requireRole('SuperAdmin'), validatePermission, permissionController.updatePermission);
router.post('/:id/delete', requireRole('SuperAdmin'), permissionController.deletePermission);

module.exports = router;
