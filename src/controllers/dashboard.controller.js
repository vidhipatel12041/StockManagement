const dashboardService = require('../services/dashboard.service');

async function showDashboard(req, res, next) {
  try {
    const summary = await dashboardService.getDashboardSummary();
    res.render('dashboard/index', { user: req.session.user, summary });
  } catch (err) {
    next(err);
  }
}

module.exports = { showDashboard };
