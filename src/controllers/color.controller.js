const colorService = require('../services/color.service');

async function listColors(req, res, next) {
  try {
    const colors = await colorService.listColors();
    res.render('colors/index', { user: req.session.user, colors });
  } catch (err) {
    next(err);
  }
}

async function showCreateColor(req, res, next) {
  try {
    res.render('colors/create', { user: req.session.user, values: {}, error: null });
  } catch (err) {
    next(err);
  }
}

async function createColor(req, res, next) {
  try {
    await colorService.createColor(req.body);
    res.redirect('/colors');
  } catch (err) {
    res.render('colors/create', { user: req.session.user, values: req.body, error: err.message });
  }
}

async function showEditColor(req, res, next) {
  try {
    const color = await colorService.getColorById(req.params.id);
    if (!color) return res.status(404).render('errors/404');
    res.render('colors/edit', { user: req.session.user, values: color, error: null });
  } catch (err) {
    next(err);
  }
}

async function updateColor(req, res, next) {
  try {
    await colorService.updateColor(req.params.id, req.body);
    res.redirect('/colors');
  } catch (err) {
    res.render('colors/edit', { user: req.session.user, values: { ...req.body, _id: req.params.id }, error: err.message });
  }
}

async function deleteColor(req, res, next) {
  try {
    await colorService.deleteColor(req.params.id);
    res.redirect('/colors');
  } catch (err) {
    next(err);
  }
}

module.exports = { listColors, showCreateColor, createColor, showEditColor, updateColor, deleteColor };
