const importService = require('../services/import.service');

async function showImportDashboard(req, res, next) {
  try {
    const logs = await importService.listImportLogs();
    res.render('imports/index', { user: req.session.user, logs, error: null, result: null });
  } catch (err) {
    next(err);
  }
}

async function showStockImport(req, res, next) {
  try {
    res.render('imports/stock', { user: req.session.user, error: null, result: null });
  } catch (err) {
    next(err);
  }
}

async function handleStockImport(req, res, next) {
  try {
    if (!req.file) {
      return res.render('imports/stock', { user: req.session.user, error: 'Please upload an Excel file.', result: null });
    }

    const { summary, errors } = await importService.stockImport(req.file.buffer, req.file.originalname, req.user._id);
    res.render('imports/stock', { user: req.session.user, error: null, result: { summary, errors } });
  } catch (err) {
    res.render('imports/stock', { user: req.session.user, error: err.message, result: null });
  }
}

async function showSalesImport(req, res, next) {
  try {
    res.render('imports/sales', { user: req.session.user, error: null, result: null });
  } catch (err) {
    next(err);
  }
}

async function handleSalesImport(req, res, next) {
  try {
    if (!req.file) {
      return res.render('imports/sales', { user: req.session.user, error: 'Please upload an Excel file.', result: null });
    }

    const { summary, errors } = await importService.salesImport(req.file.buffer, req.file.originalname, req.user._id);
    res.render('imports/sales', { user: req.session.user, error: null, result: { summary, errors } });
  } catch (err) {
    res.render('imports/sales', { user: req.session.user, error: err.message, result: null });
  }
}

module.exports = { showImportDashboard, showStockImport, handleStockImport, showSalesImport, handleSalesImport };
