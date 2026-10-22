const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { requireAuth } = require('../middlewares/authMiddleware');
const { 
  validateNotificationId,
  handleValidationErrors 
} = require('../validators/phase5.validator');

router.use(requireAuth);

router.get('/', notificationController.getNotifications);
router.post('/:id/read', 
  validateNotificationId,
  handleValidationErrors,
  notificationController.markAsRead
);
router.post('/mark-all-read', notificationController.markAllAsRead);
router.delete('/:id', 
  validateNotificationId,
  handleValidationErrors,
  notificationController.deleteNotification
);
module.exports = router;