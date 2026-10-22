const StockTransaction = require('../models/stockTransaction.model');

function findAllTransactions() {
  return StockTransaction.find().populate('branch product createdBy').sort({ createdAt: -1 });
}

function createTransaction(data) {
  return StockTransaction.create(data);
}

function findTransactionById(id) {
  return StockTransaction.findById(id).populate('branch product createdBy');
}

module.exports = { findAllTransactions, createTransaction, findTransactionById };
