const Brand = require('../models/brand.model');

function findAllBrands() {
  return Brand.find().sort({ createdAt: -1 });
}

function findBrandById(id) {
  return Brand.findById(id);
}

function findBrandByName(name) {
  return Brand.findOne({ name: new RegExp(`^${name}$`, 'i') });
}

function createBrand(data) {
  return Brand.create(data);
}

function updateBrand(id, data) {
  return Brand.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

function deleteBrand(id) {
  return Brand.findByIdAndDelete(id);
}

module.exports = { findAllBrands, findBrandById, findBrandByName, createBrand, updateBrand, deleteBrand };
