const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.get('/', (req, res) => { res.redirect('/dashboard'); });
router.get('/login', authController.showLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.logout);
router.get('/register', authController.showRegister);
router.post('/register', authController.postRegister);

module.exports = router;
