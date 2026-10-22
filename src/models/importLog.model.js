const mongoose = require('mongoose');

const ImportLogSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['stock', 'sales'], required: true },
    fileName: { type: String, required: true, trim: true },
    status: { type: String, enum: ['success', 'partial', 'failed'], required: true },
    processed: { type: Number, default: 0, min: 0 },
    successCount: { type: Number, default: 0, min: 0 },
    failedCount: { type: Number, default: 0, min: 0 },
    summary: { type: String, trim: true },
    errors: [{ type: String, trim: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ImportLog', ImportLogSchema);
