const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { validateRole } = require('../validators/role.validator');

router.use(requireAuth);
router.get('/', requireRole('SuperAdmin'), roleController.listRoles);
router.get('/create', requireRole('SuperAdmin'), roleController.showCreateRole);
router.post('/create', requireRole('SuperAdmin'), validateRole, roleController.createRole);
router.get('/:id/edit', requireRole('SuperAdmin'), roleController.showEditRole);
router.post('/:id/edit', requireRole('SuperAdmin'), validateRole, roleController.updateRole);
router.post('/:id/delete', requireRole('SuperAdmin'), roleController.deleteRole);

module.exports = router;
