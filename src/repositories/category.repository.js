const Category = require('../models/category.model');

function findAllCategories() {
  return Category.find().sort({ createdAt: -1 });
}

function findCategoryById(id) {
  return Category.findById(id);
}

function findCategoryByName(name) {
  return Category.findOne({ name: new RegExp(`^${name}$`, 'i') });
}

function createCategory(data) {
  return Category.create(data);
}

function updateCategory(id, data) {
  return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

function deleteCategory(id) {
  return Category.findByIdAndDelete(id);
}

module.exports = { findAllCategories, findCategoryById, findCategoryByName, createCategory, updateCategory, deleteCategory };
