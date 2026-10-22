const Product = require('../models/product.model');

function findAllProducts() {
  return Product.find().populate('brand category color size').sort({ createdAt: -1 });
}

function findProductById(id) {
  return Product.findById(id).populate('brand category color size');
}

function findProductBySku(sku) {
  return Product.findOne({ sku: sku.trim() });
}

function findProductByBarcode(barcode) {
  return Product.findOne({ barcode: barcode.trim() });
}

function createProduct(data) {
  return Product.create(data);
}

function updateProduct(id, data) {
  return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('brand category color size');
}

function deleteProduct(id) {
  return Product.findByIdAndDelete(id);
}

module.exports = { findAllProducts, findProductById, findProductBySku, findProductByBarcode, createProduct, updateProduct, deleteProduct };
