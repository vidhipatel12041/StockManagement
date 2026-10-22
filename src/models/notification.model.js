const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['transfer', 'stock', 'sales', 'approval', 'system'], required: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    relatedEntity: { type: String, trim: true },
    relatedId: { type: mongoose.Schema.Types.ObjectId },
    isRead: { type: Boolean, default: false },
    actionUrl: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
