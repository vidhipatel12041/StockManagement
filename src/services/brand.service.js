const brandRepo = require('../repositories/brand.repository');

async function listBrands() {
  return brandRepo.findAllBrands();
}

async function getBrandById(id) {
  return brandRepo.findBrandById(id);
}

async function createBrand(data) {
  data.name = data.name.trim();
  const existing = await brandRepo.findBrandByName(data.name);
  if (existing) throw new Error('Brand name already exists');
  return brandRepo.createBrand(data);
}

async function updateBrand(id, data) {
  if (data.name) data.name = data.name.trim();
  return brandRepo.updateBrand(id, data);
}

async function deleteBrand(id) {
  return brandRepo.deleteBrand(id);
}

module.exports = { listBrands, getBrandById, createBrand, updateBrand, deleteBrand };
