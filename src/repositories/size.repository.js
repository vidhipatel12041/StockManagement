const Size = require('../models/size.model');

function findAllSizes() {
  return Size.find().sort({ createdAt: -1 });
}

function findSizeById(id) {
  return Size.findById(id);
}

function findSizeByName(name) {
  return Size.findOne({ name: new RegExp(`^${name}$`, 'i') });
}

function createSize(data) {
  return Size.create(data);
}

function updateSize(id, data) {
  return Size.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

function deleteSize(id) {
  return Size.findByIdAndDelete(id);
}

module.exports = { findAllSizes, findSizeById, findSizeByName, createSize, updateSize, deleteSize };
