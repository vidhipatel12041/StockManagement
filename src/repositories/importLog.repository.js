const ImportLog = require('../models/importLog.model');

function createImportLog(data) {
  return ImportLog.create(data);
}

function findAllImportLogs() {
  return ImportLog.find().populate('createdBy').sort({ createdAt: -1 });
}

module.exports = { createImportLog, findAllImportLogs };
