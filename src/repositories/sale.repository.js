const Sale = require('../models/sale.model');

function findAllSales() {
  return Sale.find().populate('branch product createdBy').sort({ saleDate: -1, createdAt: -1 });
}

function createSale(data) {
  return Sale.create(data);
}

module.exports = { findAllSales, createSale };
