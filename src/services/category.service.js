const categoryRepo = require('../repositories/category.repository');

async function listCategories() {
  return categoryRepo.findAllCategories();
}

async function getCategoryById(id) {
  return categoryRepo.findCategoryById(id);
}

async function createCategory(data) {
  data.name = data.name.trim();
  const existing = await categoryRepo.findCategoryByName(data.name);
  if (existing) throw new Error('Category name already exists');
  return categoryRepo.createCategory(data);
}

async function updateCategory(id, data) {
  if (data.name) data.name = data.name.trim();
  return categoryRepo.updateCategory(id, data);
}

async function deleteCategory(id) {
  return categoryRepo.deleteCategory(id);
}

module.exports = { listCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
