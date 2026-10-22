const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { validateUser } = require('../validators/user.validator');

router.use(requireAuth);
router.get('/', requireRole('SuperAdmin','Admin'), userController.listUsers);
router.get('/create', requireRole('SuperAdmin','Admin'), userController.showCreateUser);
router.post('/create', requireRole('SuperAdmin','Admin'), validateUser, userController.createUser);
router.get('/:id/edit', requireRole('SuperAdmin','Admin'), userController.showEditUser);
router.post('/:id/edit', requireRole('SuperAdmin','Admin'), validateUser, userController.updateUser);
router.post('/:id/delete', requireRole('SuperAdmin','Admin'), userController.deleteUser);

module.exports = router;
