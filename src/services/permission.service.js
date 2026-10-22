const permissionRepo = require('../repositories/permission.repository');

async function listPermissions() {
  return permissionRepo.findAllPermissions();
}

async function getPermissionById(id) {
  return permissionRepo.findPermissionById(id);
}

async function createPermission(data) {
  return permissionRepo.createPermission(data);
}

async function updatePermission(id, data) {
  return permissionRepo.updatePermission(id, data);
}

async function deletePermission(id) {
  return permissionRepo.deletePermission(id);
}

module.exports = { listPermissions, getPermissionById, createPermission, updatePermission, deletePermission };
