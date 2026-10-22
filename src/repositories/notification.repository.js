const Notification = require('../models/notification.model');

async function createNotification(data) {
  return Notification.create(data);
}

async function findUserNotifications(userId) {
  return Notification.find({ user: userId }).sort({ createdAt: -1 });
}

async function markAsRead(notificationId) {
  return Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
}

async function markAllAsRead(userId) {
  return Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
}

async function deleteNotification(notificationId) {
  return Notification.findByIdAndDelete(notificationId);
}

module.exports = { createNotification, findUserNotifications, markAsRead, markAllAsRead, deleteNotification };
