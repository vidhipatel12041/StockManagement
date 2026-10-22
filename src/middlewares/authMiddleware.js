const { verifyToken, getTokenFromRequest } = require('../helpers/jwt.helper');
const userRepo = require('../repositories/user.repository');

async function requireAuth(req, res, next) {
  try {
    if (req.session?.user) {
      req.user = await userRepo.findById(req.session.user.id);
      if (!req.user || req.user.status !== 'active') {
        return res.redirect('/login');
      }
      return next();
    }

    const token = getTokenFromRequest(req);
    if (!token) {
      return res.redirect('/login');
    }

    const payload = verifyToken(token);
    const user = await userRepo.findById(payload.id);
    if (!user || user.status !== 'active') {
      return res.redirect('/login');
    }

    req.user = user;
    req.session.user = {
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      roleName: user.roleName,
      roleId: user.role ? user.role._id : null
    };
    next();
  } catch (err) {
    return res.redirect('/login');
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    const roleName = req.session.user?.roleName;
    if (!roleName || !roles.includes(roleName)) {
      return res.status(403).render('errors/403', { error: { message: 'Forbidden' } });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
