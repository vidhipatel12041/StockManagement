const Transfer = require('../models/transfer.model');

async function findAllTransfers() {
  return Transfer.find()
    .populate('fromBranch toBranch product createdBy approvedBy dispatchedBy receivedBy')
    .sort({ createdAt: -1 });
}

async function findTransferById(id) {
  return Transfer.findById(id).populate('fromBranch toBranch product createdBy approvedBy dispatchedBy receivedBy');
}

async function createTransfer(data) {
  return Transfer.create(data);
}

async function updateTransfer(id, data) {
  return Transfer.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('fromBranch toBranch product createdBy approvedBy dispatchedBy receivedBy');
}

module.exports = { findAllTransfers, findTransferById, createTransfer, updateTransfer };
