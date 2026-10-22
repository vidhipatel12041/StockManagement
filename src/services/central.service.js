const productRepo = require('../repositories/product.repository');
const stockRepo = require('../repositories/stock.repository');
const branchRepo = require('../repositories/branch.repository');

async function getCentralInventory() {
  const stock = await stockRepo.findAllStock();
  return stock;
}

async function searchByBarcode(barcode) {
  const product = await productRepo.findProductByBarcode(barcode.trim());
  if (!product) return null;

  const stock = await stockRepo.findAllStock();
  const availability = stock.filter((s) => s.product._id.toString() === product._id.toString());

  return {
    product,
    availability
  };
}

async function getProductByBarcode(barcode) {
  return productRepo.findProductByBarcode(barcode.trim());
}

module.exports = { getCentralInventory, searchByBarcode, getProductByBarcode };
