const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transfer.controller');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { 
  validateTransferCreation, 
  validateTransferId,
  handleValidationErrors 
} = require('../validators/phase5.validator');

router.use(requireAuth);

router.get('/', requireRole('SuperAdmin', 'Admin'), transferController.listTransfers);
router.get('/create', requireRole('SuperAdmin', 'Admin'), transferController.showCreateTransfer);
router.post('/create', 
  requireRole('SuperAdmin', 'Admin'),
  validateTransferCreation,
  handleValidationErrors,
  transferController.createTransfer
);
router.get('/:id', 
  requireRole('SuperAdmin', 'Admin'),
  validateTransferId,
  handleValidationErrors,
  transferController.showTransferDetail
);
router.post('/:id/approve', 
  requireRole('SuperAdmin', 'Admin'),
  validateTransferId,
  handleValidationErrors,
  transferController.approveTransfer
);
router.post('/:id/dispatch', 
  requireRole('SuperAdmin', 'Admin'),
  validateTransferId,
  handleValidationErrors,
  transferController.dispatchTransfer
);
router.post('/:id/receive', 
  requireRole('SuperAdmin', 'Admin'),
  validateTransferId,
  handleValidationErrors,
  transferController.receiveTransfer
);
router.post('/:id/reject', 
  requireRole('SuperAdmin', 'Admin'),
  validateTransferId,
  handleValidationErrors,
  transferController.rejectTransfer
);
module.exports = router;