const express = require('express');
const purchaseHistory = require('../controllers/purchaseHistory');
const revenueTracking = require('../controllers/revenueTracking');
const { authorAuth } = require('../middlewares/authorAuth');
const router = express.Router();

router.route('/revenue').get(revenueTracking.revenueTracking);

module.exports = router;
