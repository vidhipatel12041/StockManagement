const stockRepo = require('../repositories/stock.repository');
const transactionRepo = require('../repositories/stockTransaction.repository');

async function listStock() {
  return stockRepo.findAllStock();
}

async function listTransactions() {
  return transactionRepo.findAllTransactions();
}

async function getStock(branchId, productId) {
  return stockRepo.findStockByBranchAndProduct(branchId, productId);
}

async function getOrCreateStock(branchId, productId) {
  let stock = await stockRepo.findStockByBranchAndProduct(branchId, productId);
  if (!stock) {
    stock = await stockRepo.createStock({ branch: branchId, product: productId, quantity: 0 });
  }
  return stock;
}

async function rebuildStockFromTransactions() {
  const transactions = await transactionRepo.findAllTransactions();
  const balances = new Map();

  transactions.forEach((tx) => {
    const branchId = (tx.branch?._id ?? tx.branch).toString();
    const productId = (tx.product?._id ?? tx.product).toString();
    const key = `${branchId}-${productId}`;
    const current = balances.get(key) || 0;
    balances.set(key, tx.type === 'in' ? current + tx.quantity : current - tx.quantity);
  });

  for (const [key, quantity] of balances.entries()) {
    const [branchId, productId] = key.split('-');
    const stock = await stockRepo.findStockByBranchAndProduct(branchId, productId);
    if (stock) {
      await stockRepo.updateStock(stock._id, { quantity: Math.max(0, quantity) });
    } else {
      await stockRepo.createStock({ branch: branchId, product: productId, quantity: Math.max(0, quantity) });
    }
  }

  return { reconciled: balances.size };
}

async function listHistory() {
  return transactionRepo.findAllTransactions();
}

async function createTransaction(data, userId) {
  data.quantity = Number(data.quantity);
  if (Number.isNaN(data.quantity) || data.quantity <= 0) {
    throw new Error('Quantity must be greater than zero');
  }

  const stock = await getOrCreateStock(data.branch, data.product);
  if (data.type === 'in') {
    stock.quantity += data.quantity;
  } else {
    if (stock.quantity < data.quantity) {
      throw new Error('Not enough stock for this transaction');
    }
    stock.quantity -= data.quantity;
  }

  await stockRepo.updateStock(stock._id, { quantity: stock.quantity });

  return transactionRepo.createTransaction({
    branch: data.branch,
    product: data.product,
    type: data.type,
    quantity: data.quantity,
    reference: data.reference,
    notes: data.notes,
    createdBy: userId
  });
}

module.exports = { listStock, listTransactions, getStock, getOrCreateStock, rebuildStockFromTransactions, listHistory, createTransaction };
