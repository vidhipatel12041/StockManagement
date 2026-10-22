const sizeService = require('../services/size.service');

async function listSizes(req, res, next) {
  try {
    const sizes = await sizeService.listSizes();
    res.render('sizes/index', { user: req.session.user, sizes });
  } catch (err) {
    next(err);
  }
}

async function showCreateSize(req, res, next) {
  try {
    res.render('sizes/create', { user: req.session.user, values: {}, error: null });
  } catch (err) {
    next(err);
  }
}

async function createSize(req, res, next) {
  try {
    await sizeService.createSize(req.body);
    res.redirect('/sizes');
  } catch (err) {
    res.render('sizes/create', { user: req.session.user, values: req.body, error: err.message });
  }
}

async function showEditSize(req, res, next) {
  try {
    const size = await sizeService.getSizeById(req.params.id);
    if (!size) return res.status(404).render('errors/404');
    res.render('sizes/edit', { user: req.session.user, values: size, error: null });
  } catch (err) {
    next(err);
  }
}

async function updateSize(req, res, next) {
  try {
    await sizeService.updateSize(req.params.id, req.body);
    res.redirect('/sizes');
  } catch (err) {
    res.render('sizes/edit', { user: req.session.user, values: { ...req.body, _id: req.params.id }, error: err.message });
  }
}

async function deleteSize(req, res, next) {
  try {
    await sizeService.deleteSize(req.params.id);
    res.redirect('/sizes');
  } catch (err) {
    next(err);
  }
}

module.exports = { listSizes, showCreateSize, createSize, showEditSize, updateSize, deleteSize };
