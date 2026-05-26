const express = require('express');
const ctrl = require('../controllers/historyController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth(false), ctrl.analytics);

module.exports = router;
