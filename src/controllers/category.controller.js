const categoryService = require('../services/category.service');

async function listCategories(req, res, next) {
  try {
    const categories = await categoryService.listCategories();
    res.render('categories/index', { user: req.session.user, categories });
  } catch (err) {
    next(err);
  }
}

async function showCreateCategory(req, res, next) {
  try {
    res.render('categories/create', { user: req.session.user, values: {}, error: null });
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    await categoryService.createCategory(req.body);
    res.redirect('/categories');
  } catch (err) {
    res.render('categories/create', { user: req.session.user, values: req.body, error: err.message });
  }
}

async function showEditCategory(req, res, next) {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) return res.status(404).render('errors/404');
    res.render('categories/edit', { user: req.session.user, values: category, error: null });
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    await categoryService.updateCategory(req.params.id, req.body);
    res.redirect('/categories');
  } catch (err) {
    res.render('categories/edit', { user: req.session.user, values: { ...req.body, _id: req.params.id }, error: err.message });
  }
}

async function deleteCategory(req, res, next) {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.redirect('/categories');
  } catch (err) {
    next(err);
  }
}

module.exports = { listCategories, showCreateCategory, createCategory, showEditCategory, updateCategory, deleteCategory };
