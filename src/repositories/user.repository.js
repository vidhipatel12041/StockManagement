const User = require('../models/user.model');

async function findByEmail(email) {
  return User.findOne({ email: email.toLowerCase().trim() }).populate('role').lean();
}

async function findById(id) {
  return User.findById(id).populate('role').lean();
}

async function findAllUsers() {
  return User.find().populate('role').lean();
}

async function createUser(data) {
  const user = new User(data);
  await user.save();
  return user.toObject();
}

async function updateUser(id, data) {
  return User.findByIdAndUpdate(id, data, { new: true }).populate('role').lean();
}

async function deleteUser(id) {
  return User.findByIdAndDelete(id).lean();
}

module.exports = { findByEmail, findById, findAllUsers, createUser, updateUser, deleteUser };

