const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/', requireAuth, dashboardController.showDashboard);

module.exports = router;
