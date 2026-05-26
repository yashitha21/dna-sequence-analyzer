const express = require('express');
const ctrl = require('../controllers/historyController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth(true), ctrl.history);

module.exports = router;
