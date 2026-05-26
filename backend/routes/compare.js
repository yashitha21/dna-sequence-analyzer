const express = require('express');
const ctrl = require('../controllers/compareController');

const router = express.Router();

router.post('/', ctrl.compare);

module.exports = router;
