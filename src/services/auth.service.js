const userRepo = require('../repositories/user.repository');
const roleRepo = require('../repositories/role.repository');
const { signToken } = require('../helpers/jwt.helper');
const logger = require('../config/logger');

async function login(email, password) {
  const UserModel = require('../models/user.model');
  // Single DB lookup with role populated — no redundant userRepo.findByEmail call
  const found = await UserModel.findOne({ email: email.toLowerCase().trim() }).populate('role');
  if (!found) return null;
  const match = await found.comparePassword(password);
  if (!match) return null;
  const token = signToken({ id: found._id, roleName: found.roleName });
  logger.info(`User ${email} logged in`);
  return {
    user: {
      id: found._id,
      _id: found._id,
      name: found.name,
      email: found.email,
      roleName: found.roleName,
      role: found.role
    },
    token
  };
}

async function register(data) {
  const existing = await userRepo.findByEmail(data.email);
  if (existing) throw new Error('Email already exists');
  const defaultRole = await roleRepo.findRoleByKey('STAFF');
  if (defaultRole) {
    data.role = defaultRole._id;
    data.roleName = defaultRole.name;
  }
  const user = await userRepo.createUser(data);
  return user;
}

// signToken is intentionally NOT re-exported here.
// Callers that need to sign tokens should import directly from '../helpers/jwt.helper'.
module.exports = { login, register };

