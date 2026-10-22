const branchService = require('./branch.service');
const productService = require('./product.service');
const inventoryService = require('./inventory.service');
const saleService = require('./sale.service');
const { parseExcel } = require('./excel.service');
const stockRepo = require('../repositories/stock.repository');
const importLogRepo = require('../repositories/importLog.repository');

function normalizeKeys(row) {
  const normalized = {};
  Object.entries(row).forEach(([key, value]) => {
    if (typeof key === 'string') {
      normalized[key.trim().toLowerCase()] = typeof value === 'string' ? value.trim() : value;
    }
  });
  return normalized;
}

function parseNumber(value) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function logImport(type, fileName, summary, errors, userId) {
  return importLogRepo.createImportLog({
    type,
    fileName,
    status: errors.length === 0 ? 'success' : summary.successCount > 0 ? 'partial' : 'failed',
    processed: summary.processed,
    successCount: summary.successCount,
    failedCount: summary.failedCount,
    summary: summary.message,
    errors: errors.slice(0, 10),
    createdBy: userId
  });
}

async function stockImport(fileBuffer, fileName, userId) {
  const rows = await parseExcel(fileBuffer);
  const errors = [];
  let successCount = 0;

  for (let idx = 0; idx < rows.length; idx += 1) {
    const row = normalizeKeys(rows[idx]);
    const branchCode = row['branch code'] || row['branch_code'] || row.branch;
    const sku = row['product sku'] || row['product_sku'] || row.sku;
    const quantity = parseNumber(row.quantity || row.qty || row['stock quantity']);
    const reorderLevel = parseNumber(row['reorder level'] || row.reorder || row['reorder_level']);

    if (!branchCode || !sku || quantity === null) {
      errors.push(`Row ${idx + 2}: Missing required branch, product sku or quantity`);
      continue;
    }

    try {
      const branch = await branchService.getBranchByCode(branchCode);
      const product = await productService.getProductBySku(sku);
      if (!branch) throw new Error(`Branch not found for code ${branchCode}`);
      if (!product) throw new Error(`Product not found for SKU ${sku}`);

      const currentStock = await inventoryService.getStock(branch._id, product._id);
      const currentQuantity = currentStock ? currentStock.quantity : 0;
      const targetQuantity = quantity;
      const diff = targetQuantity - currentQuantity;

      const stock = await inventoryService.getOrCreateStock(branch._id, product._id);
      if (diff !== 0) {
        const type = diff > 0 ? 'in' : 'out';
        await inventoryService.createTransaction({
          branch: branch._id,
          product: product._id,
          type,
          quantity: Math.abs(diff),
          reference: `Stock import ${fileName}`,
          notes: `Import row ${idx + 2}`
        }, userId);
      }

      if (reorderLevel !== null) {
        await stockRepo.updateStock(stock._id, { reorderLevel, status: 'active' });
      }

      successCount += 1;
    } catch (err) {
      errors.push(`Row ${idx + 2}: ${err.message}`);
    }
  }

  const summary = {
    processed: rows.length,
    successCount,
    failedCount: rows.length - successCount,
    message: `${successCount} rows imported, ${rows.length - successCount} failed.`
  };

  await logImport('stock', fileName, summary, errors, userId);
  return { summary, errors };
}

async function salesImport(fileBuffer, fileName, userId) {
  const rows = await parseExcel(fileBuffer);
  const errors = [];
  let successCount = 0;

  for (let idx = 0; idx < rows.length; idx += 1) {
    const row = normalizeKeys(rows[idx]);
    const branchCode = row['branch code'] || row['branch_code'] || row.branch;
    const sku = row['product sku'] || row['product_sku'] || row.sku;
    const quantity = parseNumber(row.quantity || row.qty || row['sold quantity']);
    const invoiceNumber = row['invoice number'] || row.invoice || row['invoice_no'];
    const saleDate = parseDate(row['sale date'] || row.sale_date || row.date);
    const totalAmount = parseNumber(row['total amount'] || row.total || row.amount || 0);
    const customerName = row['customer name'] || row.customer;
    const notes = row.notes || row.comment;

    if (!branchCode || !sku || quantity === null || !invoiceNumber || !saleDate || totalAmount === null) {
      errors.push(`Row ${idx + 2}: Missing required sale import fields`);
      continue;
    }

    try {
      const branch = await branchService.getBranchByCode(branchCode);
      const product = await productService.getProductBySku(sku);
      if (!branch) throw new Error(`Branch not found for code ${branchCode}`);
      if (!product) throw new Error(`Product not found for SKU ${sku}`);

      await inventoryService.createTransaction({
        branch: branch._id,
        product: product._id,
        type: 'out',
        quantity,
        reference: `Sales import ${fileName}`,
        notes: `Import row ${idx + 2}`
      }, userId);

      await saleService.createSale({
        invoiceNumber,
        branch: branch._id,
        product: product._id,
        quantity,
        saleDate,
        totalAmount,
        customerName,
        notes,
        createdBy: userId
      });

      successCount += 1;
    } catch (err) {
      errors.push(`Row ${idx + 2}: ${err.message}`);
    }
  }

  const summary = {
    processed: rows.length,
    successCount,
    failedCount: rows.length - successCount,
    message: `${successCount} rows imported, ${rows.length - successCount} failed.`
  };

  await logImport('sales', fileName, summary, errors, userId);
  return { summary, errors };
}

async function listImportLogs() {
  return importLogRepo.findAllImportLogs();
}

module.exports = { stockImport, salesImport, listImportLogs };
