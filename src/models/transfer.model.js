const mongoose = require('mongoose');

const TransferSchema = new mongoose.Schema(
  {
    transferNo: { type: String, required: true, unique: true, trim: true },
    fromBranch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    toBranch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ['pending', 'approved', 'dispatched', 'received', 'rejected'], default: 'pending' },
    notes: { type: String, trim: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dispatchedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    approvedAt: { type: Date },
    dispatchedAt: { type: Date },
    receivedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transfer', TransferSchema);
