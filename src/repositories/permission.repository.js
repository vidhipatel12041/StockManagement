const Permission = require('../models/permission.model');

async function findAllPermissions() {
  return Permission.find().lean();
}

async function findPermissionById(id) {
  return Permission.findById(id).lean();
}

async function findPermissionByKey(key) {
  return Permission.findOne({ key: key.toUpperCase().trim() }).lean();
}

async function createPermission(data) {
  const permission = new Permission(data);
  await permission.save();
  return permission.toObject();
}

async function updatePermission(id, data) {
  return Permission.findByIdAndUpdate(id, data, { new: true }).lean();
}

async function deletePermission(id) {
  return Permission.findByIdAndDelete(id).lean();
}

module.exports = { findAllPermissions, findPermissionById, findPermissionByKey, createPermission, updatePermission, deletePermission };
