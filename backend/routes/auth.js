const express = require('express');
const ctrl = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', ctrl.register);
router.post('/login',    ctrl.login);
router.get('/me',        auth(true), ctrl.me);

module.exports = router;
