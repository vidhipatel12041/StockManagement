const transferRepo = require('../repositories/transfer.repository');
const notificationRepo = require('../repositories/notification.repository');
const inventoryService = require('./inventory.service');
const branchService = require('./branch.service');
const socketService = require('./socket.service');

function generateTransferNo() {
  return `TRF-${Date.now()}`;
}

async function listAllTransfers() {
  return transferRepo.findAllTransfers();
}

async function getTransferById(id) {
  return transferRepo.findTransferById(id);
}

async function initiateTransfer(data, userId) {
  const { fromBranch, toBranch, product, notes } = data;
  const quantity = Number(data.quantity);
  if (!fromBranch || !toBranch || !product || !quantity) {
    throw new Error('Missing required transfer fields');
  }

  const stock = await inventoryService.getStock(fromBranch, product);
  if (!stock || stock.quantity < quantity) {
    throw new Error('Insufficient stock at source branch');
  }

  const transfer = await transferRepo.createTransfer({
    transferNo: generateTransferNo(),
    fromBranch,
    toBranch,
    product,
    quantity,
    notes,
    createdBy: userId,
    status: 'pending'
  });

  return transfer;
}

async function approveTransfer(transferId, userId) {
  const transfer = await transferRepo.findTransferById(transferId);
  if (!transfer) throw new Error('Transfer not found');
  if (transfer.status !== 'pending') throw new Error('Only pending transfers can be approved');

  const updated = await transferRepo.updateTransfer(transferId, {
    status: 'approved',
    approvedBy: userId,
    approvedAt: new Date()
  });

  await notificationRepo.createNotification({
    user: transfer.createdBy,
    type: 'approval',
    subject: 'Transfer Approved',
    message: `Transfer ${transfer.transferNo} has been approved`,
    relatedEntity: 'Transfer',
    relatedId: transferId,
    actionUrl: `/transfers/${transferId}`
  });

  // Emit real-time transfer update
  const populatedTransfer = await transferRepo.findTransferById(transferId);
  socketService.emitTransferUpdate(populatedTransfer);

  return updated;
}

async function dispatchTransfer(transferId, userId) {
  const transfer = await transferRepo.findTransferById(transferId);
  if (!transfer) throw new Error('Transfer not found');
  if (transfer.status !== 'approved') throw new Error('Only approved transfers can be dispatched');

  const updated = await transferRepo.updateTransfer(transferId, {
    status: 'dispatched',
    dispatchedBy: userId,
    dispatchedAt: new Date()
  });

  await inventoryService.createTransaction({
    branch: transfer.fromBranch,
    product: transfer.product,
    type: 'out',
    quantity: transfer.quantity,
    reference: `Transfer out ${transfer.transferNo}`,
    notes: `Dispatch to ${transfer.toBranch}`
  }, userId);

  await notificationRepo.createNotification({
    user: transfer.createdBy,
    type: 'transfer',
    subject: 'Transfer Dispatched',
    message: `Transfer ${transfer.transferNo} has been dispatched`,
    relatedEntity: 'Transfer',
    relatedId: transferId,
    actionUrl: `/transfers/${transferId}`
  });

  // Emit real-time transfer and stock updates
  const populatedTransfer = await transferRepo.findTransferById(transferId);
  socketService.emitTransferUpdate(populatedTransfer);
  socketService.emitStockUpdate(transfer.fromBranch, transfer.product, transfer.quantity, 'out');

  return updated;
}

async function receiveTransfer(transferId, userId) {
  const transfer = await transferRepo.findTransferById(transferId);
  if (!transfer) throw new Error('Transfer not found');
  if (transfer.status !== 'dispatched') throw new Error('Only dispatched transfers can be received');

  const updated = await transferRepo.updateTransfer(transferId, {
    status: 'received',
    receivedBy: userId,
    receivedAt: new Date()
  });

  await inventoryService.createTransaction({
    branch: transfer.toBranch,
    product: transfer.product,
    type: 'in',
    quantity: transfer.quantity,
    reference: `Transfer in ${transfer.transferNo}`,
    notes: `Received from ${transfer.fromBranch}`
  }, userId);

  await notificationRepo.createNotification({
    user: transfer.createdBy,
    type: 'transfer',
    subject: 'Transfer Received',
    message: `Transfer ${transfer.transferNo} has been received`,
    relatedEntity: 'Transfer',
    relatedId: transferId,
    actionUrl: `/transfers/${transferId}`
  });

  // Emit real-time transfer and stock updates
  const populatedTransfer = await transferRepo.findTransferById(transferId);
  socketService.emitTransferUpdate(populatedTransfer);
  socketService.emitStockUpdate(transfer.toBranch, transfer.product, transfer.quantity, 'in');

  return updated;
}

async function rejectTransfer(transferId, userId) {
  const transfer = await transferRepo.findTransferById(transferId);
  if (!transfer) throw new Error('Transfer not found');
  if (transfer.status !== 'pending') throw new Error('Only pending transfers can be rejected');

  const updated = await transferRepo.updateTransfer(transferId, {
    status: 'rejected'
  });

  await notificationRepo.createNotification({
    user: transfer.createdBy,
    type: 'approval',
    subject: 'Transfer Rejected',
    message: `Transfer ${transfer.transferNo} has been rejected`,
    relatedEntity: 'Transfer',
    relatedId: transferId,
    actionUrl: `/transfers/${transferId}`
  });

  // Emit real-time transfer update
  const populatedTransfer = await transferRepo.findTransferById(transferId);
  socketService.emitTransferUpdate(populatedTransfer);

  return updated;
}

module.exports = {
  listAllTransfers,
  getTransferById,
  initiateTransfer,
  approveTransfer,
  dispatchTransfer,
  receiveTransfer,
  rejectTransfer
};
