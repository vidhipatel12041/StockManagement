const productRepo = require('../repositories/product.repository');

function normalizeNumeric(value) {
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

async function listProducts() {
  return productRepo.findAllProducts();
}

async function getProductById(id) {
  return productRepo.findProductById(id);
}

async function getProductBySku(sku) {
  return productRepo.findProductBySku(sku.trim());
}

async function createProduct(data) {
  data.name = data.name.trim();
  data.sku = data.sku.trim();
  data.barcode = data.barcode.trim();
  data.mrp = normalizeNumeric(data.mrp);
  data.purchasePrice = normalizeNumeric(data.purchasePrice);
  data.sellingPrice = normalizeNumeric(data.sellingPrice);
  data.gst = normalizeNumeric(data.gst);

  const existingSku = await productRepo.findProductBySku(data.sku);
  if (existingSku) throw new Error('Product SKU already exists');

  const existingBarcode = await productRepo.findProductByBarcode(data.barcode);
  if (existingBarcode) throw new Error('Product barcode already exists');

  return productRepo.createProduct(data);
}

async function updateProduct(id, data) {
  if (data.name) data.name = data.name.trim();
  if (data.sku) data.sku = data.sku.trim();
  if (data.barcode) data.barcode = data.barcode.trim();
  if (data.mrp !== undefined) data.mrp = normalizeNumeric(data.mrp);
  if (data.purchasePrice !== undefined) data.purchasePrice = normalizeNumeric(data.purchasePrice);
  if (data.sellingPrice !== undefined) data.sellingPrice = normalizeNumeric(data.sellingPrice);
  if (data.gst !== undefined) data.gst = normalizeNumeric(data.gst);

  const existingSku = await productRepo.findProductBySku(data.sku);
  if (existingSku && existingSku._id.toString() !== id) throw new Error('Product SKU already exists');

  const existingBarcode = await productRepo.findProductByBarcode(data.barcode);
  if (existingBarcode && existingBarcode._id.toString() !== id) throw new Error('Product barcode already exists');

  return productRepo.updateProduct(id, data);
}

async function deleteProduct(id) {
  return productRepo.deleteProduct(id);
}

module.exports = { listProducts, getProductById, createProduct, updateProduct, deleteProduct };
