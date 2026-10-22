const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true, unique: true },
    barcode: { type: String, required: true, trim: true, unique: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color', required: true },
    size: { type: mongoose.Schema.Types.ObjectId, ref: 'Size', required: true },
    description: { type: String, trim: true },
    hsn: { type: String, trim: true },
    gst: { type: Number, default: 0 },
    mrp: { type: Number, default: 0 },
    purchasePrice: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
