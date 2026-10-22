const notificationService = require('../services/notification.service');

async function getNotifications(req, res, next) {
  try {
    const notifications = await notificationService.getNotifications(req.user._id);
    res.render('notifications/index', { user: req.session.user, notifications });
  } catch (err) {
    next(err);
  }
}

async function markAsRead(req, res, next) {
  try {
    await notificationService.markNotificationAsRead(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function markAllAsRead(req, res, next) {
  try {
    await notificationService.markAllNotificationsAsRead(req.user._id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function deleteNotification(req, res, next) {
  try {
    await notificationService.deleteNotification(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };
