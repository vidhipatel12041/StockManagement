const roleService = require('../services/role.service');
const permissionService = require('../services/permission.service');

async function listRoles(req, res, next) {
  try {
    const roles = await roleService.listRoles();
    res.render('roles/index', { user: req.session.user, roles });
  } catch (err) {
    next(err);
  }
}

async function showCreateRole(req, res, next) {
  try {
    const permissions = await permissionService.listPermissions();
    res.render('roles/create', { user: req.session.user, permissions, values: {}, error: null });
  } catch (err) {
    next(err);
  }
}

async function createRole(req, res, next) {
  try {
    await roleService.createRole(req.body);
    res.redirect('/roles');
  } catch (err) {
    const permissions = await permissionService.listPermissions();
    res.render('roles/create', { user: req.session.user, permissions, values: req.body, error: err.message });
  }
}

async function showEditRole(req, res, next) {
  try {
    const [role, permissions] = await Promise.all([roleService.getRoleById(req.params.id), permissionService.listPermissions()]);
    if (!role) return res.status(404).render('errors/404');
    res.render('roles/edit', { user: req.session.user, role, permissions, values: role, error: null });
  } catch (err) {
    next(err);
  }
}

async function updateRole(req, res, next) {
  try {
    await roleService.updateRole(req.params.id, req.body);
    res.redirect('/roles');
  } catch (err) {
    const permissions = await permissionService.listPermissions();
    res.render('roles/edit', { user: req.session.user, role: { _id: req.params.id }, permissions, values: req.body, error: err.message });
  }
}

async function deleteRole(req, res, next) {
  try {
    await roleService.deleteRole(req.params.id);
    res.redirect('/roles');
  } catch (err) {
    next(err);
  }
}

module.exports = { listRoles, showCreateRole, createRole, showEditRole, updateRole, deleteRole };
