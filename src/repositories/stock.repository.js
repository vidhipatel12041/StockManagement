const Stock = require('../models/stock.model');

function findAllStock() {
  return Stock.find().populate('branch product').sort({ updatedAt: -1 });
}

function findStockByBranchAndProduct(branch, product) {
  return Stock.findOne({ branch, product });
}

function findStockById(id) {
  return Stock.findById(id).populate('branch product');
}

function createStock(data) {
  return Stock.create(data);
}

function updateStock(id, data) {
  return Stock.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

function deleteStock(id) {
  return Stock.findByIdAndDelete(id);
}

module.exports = { findAllStock, findStockByBranchAndProduct, findStockById, createStock, updateStock, deleteStock };
