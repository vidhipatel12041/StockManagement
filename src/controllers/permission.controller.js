const permissionService = require('../services/permission.service');

async function listPermissions(req, res, next) {
  try {
    const permissions = await permissionService.listPermissions();
    res.render('permissions/index', { user: req.session.user, permissions });
  } catch (err) {
    next(err);
  }
}

async function showCreatePermission(req, res, next) {
  try {
    res.render('permissions/create', { user: req.session.user, values: {}, error: null });
  } catch (err) {
    next(err);
  }
}

async function createPermission(req, res, next) {
  try {
    await permissionService.createPermission(req.body);
    res.redirect('/permissions');
  } catch (err) {
    res.render('permissions/create', { user: req.session.user, values: req.body, error: err.message });
  }
}

async function showEditPermission(req, res, next) {
  try {
    const permission = await permissionService.getPermissionById(req.params.id);
    if (!permission) return res.status(404).render('errors/404');
    res.render('permissions/edit', { user: req.session.user, values: permission, error: null });
  } catch (err) {
    next(err);
  }
}

async function updatePermission(req, res, next) {
  try {
    await permissionService.updatePermission(req.params.id, req.body);
    res.redirect('/permissions');
  } catch (err) {
    res.render('permissions/edit', { user: req.session.user, values: req.body, error: err.message });
  }
}

async function deletePermission(req, res, next) {
  try {
    await permissionService.deletePermission(req.params.id);
    res.redirect('/permissions');
  } catch (err) {
    next(err);
  }
}

module.exports = { listPermissions, showCreatePermission, createPermission, showEditPermission, updatePermission, deletePermission };
