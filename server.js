require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { initSocket } = require('./src/config/socket');
const logger = require('./src/config/logger');
const { connectDatabase } = require('./src/config/database');
const { seedBaseData } = require('./src/config/seed');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

initSocket(server);

async function start() {
  try {
    await connectDatabase();
    await seedBaseData();
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

process.on('SIGINT', () => {
  logger.info('Graceful shutdown');
  server.close(() => process.exit(0));
});
