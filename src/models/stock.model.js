const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 0, min: 0 },
    reorderLevel: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);

StockSchema.index({ branch: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Stock', StockSchema);
