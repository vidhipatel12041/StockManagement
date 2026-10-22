const userService = require('../services/user.service');
const roleRepo = require('../repositories/role.repository');

async function listUsers(req, res, next) {
  try {
    const users = await userService.listUsers();
    res.render('users/index', { user: req.session.user, users });
  } catch (err) {
    next(err);
  }
}

async function showCreateUser(req, res, next) {
  try {
    const roles = await roleRepo.findAllRoles();
    res.render('users/create', { user: req.session.user, roles, error: null, values: {} });
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    await userService.createUser(req.body);
    res.redirect('/users');
  } catch (err) {
    const roles = await roleRepo.findAllRoles();
    res.render('users/create', { user: req.session.user, roles, error: err.message, values: req.body });
  }
}

async function showEditUser(req, res, next) {
  try {
    const [user, roles] = await Promise.all([userService.getUserById(req.params.id), roleRepo.findAllRoles()]);
    if (!user) return res.status(404).render('errors/404');
    res.render('users/edit', { user: req.session.user, roles, values: user, error: null });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    await userService.updateUser(req.params.id, req.body);
    res.redirect('/users');
  } catch (err) {
    const roles = await roleRepo.findAllRoles();
    res.render('users/edit', { user: req.session.user, roles, values: req.body, error: err.message });
  }
}

async function deleteUser(req, res, next) {
  try {
    await userService.deleteUser(req.params.id);
    res.redirect('/users');
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, showCreateUser, createUser, showEditUser, updateUser, deleteUser };
