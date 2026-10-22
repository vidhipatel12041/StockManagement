const notificationRepo = require('../repositories/notification.repository');
const socketService = require('./socket.service');

async function getNotifications(userId) {
  return notificationRepo.findUserNotifications(userId);
}

async function getUnreadNotifications(userId) {
  const notifications = await notificationRepo.findUserNotifications(userId);
  return notifications.filter((n) => !n.isRead);
}

async function markNotificationAsRead(notificationId) {
  return notificationRepo.markAsRead(notificationId);
}

async function markAllNotificationsAsRead(userId) {
  return notificationRepo.markAllAsRead(userId);
}

async function createNotification(data) {
  const notification = await notificationRepo.createNotification(data);
  
  // Emit real-time notification to user
  socketService.notifyUser(data.user.toString(), 'newNotification', {
    id: notification._id,
    type: notification.type,
    subject: notification.subject,
    message: notification.message,
    actionUrl: notification.actionUrl
  });
  
  return notification;
}

async function deleteNotification(notificationId) {
  return notificationRepo.deleteNotification(notificationId);
}

module.exports = {
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification,
  deleteNotification
};
