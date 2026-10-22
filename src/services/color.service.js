const colorRepo = require('../repositories/color.repository');

async function listColors() {
  return colorRepo.findAllColors();
}

async function getColorById(id) {
  return colorRepo.findColorById(id);
}

async function createColor(data) {
  data.name = data.name.trim();
  if (data.hexCode) data.hexCode = data.hexCode.toUpperCase().trim();
  const existing = await colorRepo.findColorByName(data.name);
  if (existing) throw new Error('Color name already exists');
  return colorRepo.createColor(data);
}

async function updateColor(id, data) {
  if (data.name) data.name = data.name.trim();
  if (data.hexCode) data.hexCode = data.hexCode.toUpperCase().trim();
  return colorRepo.updateColor(id, data);
}

async function deleteColor(id) {
  return colorRepo.deleteColor(id);
}

module.exports = { listColors, getColorById, createColor, updateColor, deleteColor };
