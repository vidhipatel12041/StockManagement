const mongoose = require('mongoose');

const ColorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    hexCode: { type: String, trim: true, uppercase: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Color', ColorSchema);
