const permissionRepo = require('../repositories/permission.repository');
const roleRepo = require('../repositories/role.repository');
const userRepo = require('../repositories/user.repository');
const logger = require('./logger');

const basePermissions = [
  { key: 'MANAGE_USERS', name: 'Manage Users', description: 'Create and update user accounts' },
  { key: 'MANAGE_ROLES', name: 'Manage Roles', description: 'Create and update roles' },
  { key: 'MANAGE_PERMISSIONS', name: 'Manage Permissions', description: 'Create and update permissions' }
];

const baseRoles = [
  { key: 'SUPERADMIN', name: 'SuperAdmin', description: 'Full system access', permissions: ['MANAGE_USERS', 'MANAGE_ROLES', 'MANAGE_PERMISSIONS'] },
  { key: 'ADMIN', name: 'Admin', description: 'Administrative access', permissions: ['MANAGE_USERS'] },
  { key: 'BRANCHMANAGER', name: 'BranchManager', description: 'Branch operations access', permissions: [] },
  { key: 'STAFF', name: 'Staff', description: 'Sales staff access', permissions: [] }
];

async function seedBaseData() {
  const existingPermissions = await permissionRepo.findAllPermissions();
  if (existingPermissions.length === 0) {
    for (const permission of basePermissions) {
      await permissionRepo.createPermission(permission);
    }
    logger.info('Seeded base permissions');
  }

  const existingRoles = await roleRepo.findAllRoles();
  if (existingRoles.length === 0) {
    for (const role of baseRoles) {
      const permissionRecords = [];
      for (const key of role.permissions) {
        const permission = await permissionRepo.findPermissionByKey(key);
        if (permission) permissionRecords.push(permission._id);
      }
      await roleRepo.createRole({ ...role, permissions: permissionRecords });
    }
    logger.info('Seeded base roles');
  }

  const superAdmin = await userRepo.findByEmail('admin@erp.local');
  if (!superAdmin) {
    const role = await roleRepo.findRoleByKey('SUPERADMIN');
    await userRepo.createUser({
      name: 'Super Admin',
      email: 'admin@erp.local',
      password: 'Admin123!',
      role: role?._id,
      roleName: 'SuperAdmin',
      status: 'active'
    });
    logger.info('Seeded default super admin user');
  }
}

module.exports = { seedBaseData };
