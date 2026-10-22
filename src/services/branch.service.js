const branchRepo = require('../repositories/branch.repository');

async function listBranches() {
  return branchRepo.findAllBranches();
}

async function getBranchById(id) {
  return branchRepo.findBranchById(id);
}

async function getBranchByCode(code) {
  return branchRepo.findBranchByCode(code.toUpperCase().trim());
}

async function createBranch(data) {
  data.code = data.code.toUpperCase().trim();
  const existing = await branchRepo.findBranchByCode(data.code);
  if (existing) throw new Error('Branch code already exists');
  return branchRepo.createBranch(data);
}

async function updateBranch(id, data) {
  if (data.code) data.code = data.code.toUpperCase().trim();
  return branchRepo.updateBranch(id, data);
}

async function deleteBranch(id) {
  return branchRepo.deleteBranch(id);
}

module.exports = { listBranches, getBranchById, createBranch, updateBranch, deleteBranch };
