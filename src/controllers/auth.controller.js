const authService = require('../services/auth.service');
const { signToken } = require('../helpers/jwt.helper');

async function showLogin(req, res) {
  res.render('auth/login', { error: null });
}

async function postLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    if (!result) return res.status(401).render('auth/login', { error: 'Invalid credentials' });
    req.session.user = result.user;
    res.cookie('auth_token', result.token, { httpOnly: true });
    return res.redirect('/dashboard');
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  req.session.destroy(() => {});
  res.clearCookie('auth_token');
  res.redirect('/login');
}

async function showRegister(req, res) {
  res.render('auth/register', { error: null });
}

async function postRegister(req, res, next) {
  try {
    const user = await authService.register(req.body);
    const token = signToken({ id: user._id, roleName: user.roleName });
    req.session.user = { id: user._id, _id: user._id, name: user.name, email: user.email, roleName: user.roleName };
    res.cookie('auth_token', token, { httpOnly: true });
    res.redirect('/dashboard');
  } catch (err) {
    res.status(400).render('auth/register', { error: err.message });
  }
}

module.exports = { showLogin, postLogin, logout, showRegister, postRegister };
