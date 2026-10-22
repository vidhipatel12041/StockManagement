const { Server } = require('socket.io');
const logger = require('./logger');
const socketService = require('../services/socket.service');

let io;

function initSocket(server) {
  io = new Server(server, { 
    cors: { origin: '*' },
    transports: ['websocket', 'polling']
  });

  // Initialize socket service with io instance
  socketService.initialize(io);

  io.on('connection', (socket) => {
    const userId = socket.handshake.auth.userId || socket.handshake.query.userId;
    logger.info(`Socket connected: ${socket.id} - User: ${userId || 'Anonymous'}`);

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  logger.info('Socket.io initialized successfully');
}

function getIO() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

module.exports = { initSocket, getIO, socketService };

