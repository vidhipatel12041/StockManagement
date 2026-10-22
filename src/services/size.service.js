const sizeRepo = require('../repositories/size.repository');

async function listSizes() {
  return sizeRepo.findAllSizes();
}

async function getSizeById(id) {
  return sizeRepo.findSizeById(id);
}

async function createSize(data) {
  data.name = data.name.trim();
  const existing = await sizeRepo.findSizeByName(data.name);
  if (existing) throw new Error('Size name already exists');
  return sizeRepo.createSize(data);
}

async function updateSize(id, data) {
  if (data.name) data.name = data.name.trim();
  return sizeRepo.updateSize(id, data);
}

async function deleteSize(id) {
  return sizeRepo.deleteSize(id);
}

module.exports = { listSizes, getSizeById, createSize, updateSize, deleteSize };
