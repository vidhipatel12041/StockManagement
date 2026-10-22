const userRepo = require('../repositories/user.repository');
const roleRepo = require('../repositories/role.repository');
const permissionRepo = require('../repositories/permission.repository');

async function getDashboardSummary() {
  const [users, roles, permissions] = await Promise.all([
    userRepo.findAllUsers(),
    roleRepo.findAllRoles(),
    permissionRepo.findAllPermissions()
  ]);

  return {
    userCount: users.length,
    roleCount: roles.length,
    permissionCount: permissions.length,
    recentUsers: users.slice(-5).reverse()
  };
}

module.exports = { getDashboardSummary };
