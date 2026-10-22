const Branch = require('../models/branch.model');

async function findAllBranches() {
  return Branch.find().lean();
}

async function findBranchById(id) {
  return Branch.findById(id).lean();
}

async function findBranchByCode(code) {
  return Branch.findOne({ code: code.toUpperCase().trim() }).lean();
}

async function createBranch(data) {
  const branch = new Branch(data);
  await branch.save();
  return branch.toObject();
}

async function updateBranch(id, data) {
  return Branch.findByIdAndUpdate(id, data, { new: true }).lean();
}

async function deleteBranch(id) {
  return Branch.findByIdAndDelete(id).lean();
}

module.exports = { findAllBranches, findBranchById, findBranchByCode, createBranch, updateBranch, deleteBranch };
