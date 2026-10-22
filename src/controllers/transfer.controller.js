const transferService = require('../services/transfer.service');
const branchService = require('../services/branch.service');
const productService = require('../services/product.service');

async function listTransfers(req, res, next) {
  try {
    const transfers = await transferService.listAllTransfers();
    res.render('transfers/index', { user: req.session.user, transfers });
  } catch (err) {
    next(err);
  }
}

async function showCreateTransfer(req, res, next) {
  try {
    const [branches, products] = await Promise.all([
      branchService.listBranches(),
      productService.listProducts()
    ]);
    res.render('transfers/create', { user: req.session.user, branches, products, values: {}, error: null });
  } catch (err) {
    next(err);
  }
}

async function createTransfer(req, res, next) {
  try {
    if (req.validationError) {
      throw new Error(req.validationError);
    }
    await transferService.initiateTransfer(req.body, req.user._id);
    res.redirect('/transfers');
  } catch (err) {
    const [branches, products] = await Promise.all([
      branchService.listBranches(),
      productService.listProducts()
    ]);
    res.render('transfers/create', { user: req.session.user, branches, products, values: req.body, error: err.message });
  }
}

async function showTransferDetail(req, res, next) {
  try {
    const transfer = await transferService.getTransferById(req.params.id);
    if (!transfer) return res.status(404).render('errors/404');
    res.render('transfers/detail', { user: req.session.user, transfer });
  } catch (err) {
    next(err);
  }
}

async function approveTransfer(req, res, next) {
  try {
    await transferService.approveTransfer(req.params.id, req.user._id);
    res.redirect(`/transfers/${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

async function dispatchTransfer(req, res, next) {
  try {
    await transferService.dispatchTransfer(req.params.id, req.user._id);
    res.redirect(`/transfers/${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

async function receiveTransfer(req, res, next) {
  try {
    await transferService.receiveTransfer(req.params.id, req.user._id);
    res.redirect(`/transfers/${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

async function rejectTransfer(req, res, next) {
  try {
    await transferService.rejectTransfer(req.params.id, req.user._id);
    res.redirect('/transfers');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listTransfers,
  showCreateTransfer,
  createTransfer,
  showTransferDetail,
  approveTransfer,
  dispatchTransfer,
  receiveTransfer,
  rejectTransfer
};
