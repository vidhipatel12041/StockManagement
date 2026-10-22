const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventory Management API - Phase 1',
      version: '1.0.0'
    }
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);
