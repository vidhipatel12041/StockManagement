const saleRepo = require('../repositories/sale.repository');

async function listSales() {
  return saleRepo.findAllSales();
}

async function createSale(data) {
  return saleRepo.createSale(data);
}

module.exports = { listSales, createSale };
