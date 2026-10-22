const centralService = require('../services/central.service');

async function getCentralInventory(req, res, next) {
  try {
    const inventory = await centralService.getCentralInventory();
    res.render('central/inventory', { user: req.session.user, inventory });
  } catch (err) {
    next(err);
  }
}

async function searchBarcode(req, res, next) {
  try {
    const { barcode } = req.query;
    if (barcode === undefined) {
      return res.render('central/search', { user: req.session.user, result: null, error: null, barcode: '' });
    }

    const cleanBarcode = barcode.trim();
    if (!cleanBarcode || cleanBarcode.length < 2 || cleanBarcode.length > 100) {
      return res.render('central/search', {
        user: req.session.user,
        result: null,
        error: 'Barcode must be between 2 and 100 characters',
        barcode
      });
    }

    const result = await centralService.searchByBarcode(cleanBarcode);
    if (!result) {
      return res.render('central/search', {
        user: req.session.user,
        result: null,
        error: 'Product not found',
        barcode: cleanBarcode
      });
    }

    res.render('central/search', { user: req.session.user, result, error: null, barcode: cleanBarcode });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCentralInventory, searchBarcode };
