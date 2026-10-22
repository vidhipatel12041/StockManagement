const jwt = require('jsonwebtoken');

function signToken(payload) {
  const secret = process.env.JWT_SECRET || 'secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  return jwt.sign(payload, secret, { expiresIn });
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET || 'secret';
  return jwt.verify(token, secret);
}

function getTokenFromRequest(req) {
  if (req.cookies && req.cookies.auth_token) return req.cookies.auth_token;
  if (req.headers.authorization) {
    const [type, token] = req.headers.authorization.split(' ');
    if (type === 'Bearer') return token;
  }
  return null;
}

module.exports = { signToken, verifyToken, getTokenFromRequest };
