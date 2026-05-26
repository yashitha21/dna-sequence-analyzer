const express = require('express');
const ctrl = require('../controllers/mutationController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(false), ctrl.detect);

module.exports = router;
