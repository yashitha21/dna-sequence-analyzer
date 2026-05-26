const express = require('express');
const ctrl = require('../controllers/searchController');
const auth = require('../middleware/auth');

const router = express.Router();

// Auth is optional — anonymous searches are allowed but won't be saved
router.post('/', auth(false), ctrl.runSearch);

module.exports = router;
