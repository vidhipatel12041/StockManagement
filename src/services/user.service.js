const userRepo = require('../repositories/user.repository');
const roleRepo = require('../repositories/role.repository');

async function listUsers() {
  return userRepo.findAllUsers();
}

async function getUserById(id) {
  return userRepo.findById(id);
}

async function createUser(data) {
  const role = data.role ? await roleRepo.findRoleById(data.role) : null;
  data.roleName = role ? role.name : 'Staff';
  return userRepo.createUser(data);
}

async function updateUser(id, data) {
  if (data.role) {
    const role = await roleRepo.findRoleById(data.role);
    data.roleName = role ? role.name : data.roleName;
  }
  if (!data.password) {
    delete data.password;
  }
  return userRepo.updateUser(id, data);
}

async function deleteUser(id) {
  return userRepo.deleteUser(id);
}

module.exports = { listUsers, getUserById, createUser, updateUser, deleteUser };
