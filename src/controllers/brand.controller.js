const brandService = require('../services/brand.service');

async function listBrands(req, res, next) {
  try {
    const brands = await brandService.listBrands();
    res.render('brands/index', { user: req.session.user, brands });
  } catch (err) {
    next(err);
  }
}

async function showCreateBrand(req, res, next) {
  try {
    res.render('brands/create', { user: req.session.user, values: {}, error: null });
  } catch (err) {
    next(err);
  }
}

async function createBrand(req, res, next) {
  try {
    await brandService.createBrand(req.body);
    res.redirect('/brands');
  } catch (err) {
    res.render('brands/create', { user: req.session.user, values: req.body, error: err.message });
  }
}

async function showEditBrand(req, res, next) {
  try {
    const brand = await brandService.getBrandById(req.params.id);
    if (!brand) return res.status(404).render('errors/404');
    res.render('brands/edit', { user: req.session.user, values: brand, error: null });
  } catch (err) {
    next(err);
  }
}

async function updateBrand(req, res, next) {
  try {
    await brandService.updateBrand(req.params.id, req.body);
    res.redirect('/brands');
  } catch (err) {
    res.render('brands/edit', { user: req.session.user, values: { ...req.body, _id: req.params.id }, error: err.message });
  }
}

async function deleteBrand(req, res, next) {
  try {
    await brandService.deleteBrand(req.params.id);
    res.redirect('/brands');
  } catch (err) {
    next(err);
  }
}

module.exports = { listBrands, showCreateBrand, createBrand, showEditBrand, updateBrand, deleteBrand };
