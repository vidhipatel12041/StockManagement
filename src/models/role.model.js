const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    key: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: '' },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Role', RoleSchema);
