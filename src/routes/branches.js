const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branch.controller');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { validateBranch } = require('../validators/branch.validator');

router.use(requireAuth);
router.get('/', requireRole('SuperAdmin','Admin'), branchController.listBranches);
router.get('/create', requireRole('SuperAdmin','Admin'), branchController.showCreateBranch);
router.post('/create', requireRole('SuperAdmin','Admin'), validateBranch, branchController.createBranch);
router.get('/:id/edit', requireRole('SuperAdmin','Admin'), branchController.showEditBranch);
router.post('/:id/edit', requireRole('SuperAdmin','Admin'), validateBranch, branchController.updateBranch);
router.post('/:id/delete', requireRole('SuperAdmin','Admin'), branchController.deleteBranch);

module.exports = router;
