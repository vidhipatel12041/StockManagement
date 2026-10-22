const inventoryService = require('../services/inventory.service');
const importService = require('../services/import.service');
const branchService = require('../services/branch.service');
const productService = require('../services/product.service');

async function prepareLists() {
  const [branches, products] = await Promise.all([
    branchService.listBranches(),
    productService.listProducts()
  ]);
  return { branches, products };
}

async function listStock(req, res, next) {
  try {
    const stock = await inventoryService.listStock();
    res.render('inventory/index', { user: req.session.user, stock });
  } catch (err) {
    next(err);
  }
}

async function listTransactions(req, res, next) {
  try {
    const transactions = await inventoryService.listTransactions();
    res.render('inventory/transactions', { user: req.session.user, transactions });
  } catch (err) {
    next(err);
  }
}

async function showCreateTransaction(req, res, next) {
  try {
    const lists = await prepareLists();
    res.render('inventory/create-transaction', { user: req.session.user, values: {}, error: null, ...lists });
  } catch (err) {
    next(err);
  }
}

async function createTransaction(req, res, next) {
  try {
    await inventoryService.createTransaction(req.body, req.user._id);
    res.redirect('/inventory/transactions');
  } catch (err) {
    const lists = await prepareLists();
    res.render('inventory/create-transaction', { user: req.session.user, values: req.body, error: err.message, ...lists });
  }
}

async function showInventoryEngine(req, res, next) {
  try {
    res.render('inventory/engine', { user: req.session.user, result: null, error: null });
  } catch (err) {
    next(err);
  }
}

async function runInventoryEngine(req, res, next) {
  try {
    const result = await inventoryService.rebuildStockFromTransactions();
    res.render('inventory/engine', { user: req.session.user, result, error: null });
  } catch (err) {
    res.render('inventory/engine', { user: req.session.user, result: null, error: err.message });
  }
}

async function listHistory(req, res, next) {
  try {
    const transactions = await inventoryService.listHistory();
    const importLogs = await importService.listImportLogs();
    res.render('inventory/history', { user: req.session.user, transactions, importLogs });
  } catch (err) {
    next(err);
  }
}

module.exports = { listStock, listTransactions, showCreateTransaction, createTransaction, showInventoryEngine, runInventoryEngine, listHistory };
