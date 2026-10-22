const branchService = require('../services/branch.service');

async function listBranches(req, res, next) {
  try {
    const branches = await branchService.listBranches();
    res.render('branches/index', { user: req.session.user, branches });
  } catch (err) {
    next(err);
  }
}

async function showCreateBranch(req, res, next) {
  try {
    res.render('branches/create', { user: req.session.user, values: {}, error: null });
  } catch (err) {
    next(err);
  }
}

async function createBranch(req, res, next) {
  try {
    await branchService.createBranch(req.body);
    res.redirect('/branches');
  } catch (err) {
    res.render('branches/create', { user: req.session.user, values: req.body, error: err.message });
  }
}

async function showEditBranch(req, res, next) {
  try {
    const branch = await branchService.getBranchById(req.params.id);
    if (!branch) return res.status(404).render('errors/404');
    res.render('branches/edit', { user: req.session.user, values: branch, error: null });
  } catch (err) {
    next(err);
  }
}

async function updateBranch(req, res, next) {
  try {
    await branchService.updateBranch(req.params.id, req.body);
    res.redirect('/branches');
  } catch (err) {
    res.render('branches/edit', { user: req.session.user, values: { ...req.body, _id: req.params.id }, error: err.message });
  }
}

async function deleteBranch(req, res, next) {
  try {
    await branchService.deleteBranch(req.params.id);
    res.redirect('/branches');
  } catch (err) {
    next(err);
  }
}

module.exports = { listBranches, showCreateBranch, createBranch, showEditBranch, updateBranch, deleteBranch };
