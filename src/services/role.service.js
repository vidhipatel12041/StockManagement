const roleRepo = require('../repositories/role.repository');

async function listRoles() {
  return roleRepo.findAllRoles();
}

async function getRoleById(id) {
  return roleRepo.findRoleById(id);
}

async function createRole(data) {
  return roleRepo.createRole(data);
}

async function updateRole(id, data) {
  return roleRepo.updateRole(id, data);
}

async function deleteRole(id) {
  return roleRepo.deleteRole(id);
}

module.exports = { listRoles, getRoleById, createRole, updateRole, deleteRole };
