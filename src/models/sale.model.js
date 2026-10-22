const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, trim: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    saleDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    customerName: { type: String, trim: true },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sale', SaleSchema);
