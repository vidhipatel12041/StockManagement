const Role = require('../models/role.model');

async function findAllRoles() {
  return Role.find().populate('permissions').lean();
}

async function findRoleById(id) {
  return Role.findById(id).populate('permissions').lean();
}

async function findRoleByKey(key) {
  return Role.findOne({ key: key.toUpperCase().trim() }).populate('permissions').lean();
}

async function createRole(data) {
  const role = new Role(data);
  await role.save();
  return role.toObject();
}

async function updateRole(id, data) {
  return Role.findByIdAndUpdate(id, data, { new: true }).populate('permissions').lean();
}

async function deleteRole(id) {
  return Role.findByIdAndDelete(id).lean();
}

module.exports = { findAllRoles, findRoleById, findRoleByKey, createRole, updateRole, deleteRole };
