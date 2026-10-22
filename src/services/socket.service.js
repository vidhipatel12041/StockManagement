// Socket.IO Event Emitter Service
// Handles real-time events for notifications, transfers, and stock updates

let io = null;
const userSockets = {}; // Map of userId -> socket IDs

function initialize(socketIO) {
  io = socketIO;
  setupEventHandlers();
}

function setupEventHandlers() {
  if (!io) return;

  io.on('connection', (socket) => {
    const userId = socket.handshake.auth.userId || socket.handshake.query.userId;
    
    if (userId) {
      // Store socket mapping
      if (!userSockets[userId]) {
        userSockets[userId] = [];
      }
      userSockets[userId].push(socket.id);

      socket.on('disconnect', () => {
        if (userSockets[userId]) {
          userSockets[userId] = userSockets[userId].filter(id => id !== socket.id);
          if (userSockets[userId].length === 0) {
            delete userSockets[userId];
          }
        }
      });
    }
  });
}

// Emit notification to specific user
function notifyUser(userId, eventType, data) {
  if (!io || !userSockets[userId]) return;
  
  userSockets[userId].forEach(socketId => {
    io.to(socketId).emit('notification', {
      type: eventType,
      data: data,
      timestamp: new Date().toISOString()
    });
  });
}

// Broadcast notification to all users (for system notifications)
function broadcastNotification(eventType, data) {
  if (!io) return;
  
  io.emit('notification', {
    type: eventType,
    data: data,
    timestamp: new Date().toISOString()
  });
}

// Emit transfer status update
function emitTransferUpdate(transferData) {
  if (!io) return;
  
  io.emit('transferUpdate', {
    transferId: transferData._id,
    transferNo: transferData.transferNo,
    status: transferData.status,
    fromBranch: transferData.fromBranch.name,
    toBranch: transferData.toBranch.name,
    product: transferData.product.name,
    quantity: transferData.quantity,
    timestamp: new Date().toISOString()
  });
}

// Emit stock update to all users
function emitStockUpdate(branchId, productId, quantity, type) {
  if (!io) return;
  
  io.emit('stockUpdate', {
    branchId: branchId,
    productId: productId,
    quantity: quantity,
    type: type, // 'in' or 'out'
    timestamp: new Date().toISOString()
  });
}

// Emit transfer approval request to admin users
function notifyTransferApproval(transferData, adminUserIds) {
  if (!io) return;
  
  adminUserIds.forEach(userId => {
    notifyUser(userId, 'transferApprovalRequired', {
      transferId: transferData._id,
      transferNo: transferData.transferNo,
      from: transferData.fromBranch.name,
      to: transferData.toBranch.name,
      product: transferData.product.name,
      quantity: transferData.quantity
    });
  });
}

// Get connected users count
function getConnectedUsersCount() {
  return Object.keys(userSockets).length;
}

// Get user socket IDs
function getUserSockets(userId) {
  return userSockets[userId] || [];
}

module.exports = {
  initialize,
  notifyUser,
  broadcastNotification,
  emitTransferUpdate,
  emitStockUpdate,
  notifyTransferApproval,
  getConnectedUsersCount,
  getUserSockets
};
