const Color = require('../models/color.model');

function findAllColors() {
  return Color.find().sort({ createdAt: -1 });
}

function findColorById(id) {
  return Color.findById(id);
}

function findColorByName(name) {
  return Color.findOne({ name: new RegExp(`^${name}$`, 'i') });
}

function createColor(data) {
  return Color.create(data);
}

function updateColor(id, data) {
  return Color.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

function deleteColor(id) {
  return Color.findByIdAndDelete(id);
}

module.exports = { findAllColors, findColorById, findColorByName, createColor, updateColor, deleteColor };
