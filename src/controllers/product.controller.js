const productService = require('../services/product.service');
const brandService = require('../services/brand.service');
const categoryService = require('../services/category.service');
const colorService = require('../services/color.service');
const sizeService = require('../services/size.service');

async function prepareSelectLists() {
  const [brands, categories, colors, sizes] = await Promise.all([
    brandService.listBrands(),
    categoryService.listCategories(),
    colorService.listColors(),
    sizeService.listSizes()
  ]);
  return { brands, categories, colors, sizes };
}

async function listProducts(req, res, next) {
  try {
    const products = await productService.listProducts();
    res.render('products/index', { user: req.session.user, products });
  } catch (err) {
    next(err);
  }
}

async function showCreateProduct(req, res, next) {
  try {
    const lists = await prepareSelectLists();
    res.render('products/create', { user: req.session.user, values: {}, error: null, ...lists });
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    await productService.createProduct(req.body);
    res.redirect('/products');
  } catch (err) {
    const lists = await prepareSelectLists();
    res.render('products/create', { user: req.session.user, values: req.body, error: err.message, ...lists });
  }
}

async function showEditProduct(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).render('errors/404');
    const lists = await prepareSelectLists();
    res.render('products/edit', { user: req.session.user, values: product, error: null, ...lists });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    await productService.updateProduct(req.params.id, req.body);
    res.redirect('/products');
  } catch (err) {
    const lists = await prepareSelectLists();
    res.render('products/edit', { user: req.session.user, values: { ...req.body, _id: req.params.id }, error: err.message, ...lists });
  }
}

async function deleteProduct(req, res, next) {
  try {
    await productService.deleteProduct(req.params.id);
    res.redirect('/products');
  } catch (err) {
    next(err);
  }
}

module.exports = { listProducts, showCreateProduct, createProduct, showEditProduct, updateProduct, deleteProduct };
