const express = require('express');
const purchaseHistory = require('../controllers/purchaseHistory');

const router = express.Router();

router.route('/purchaseHistory').get(purchaseHistory.purchaseHistory);
router.route('/addPurchaseHistory').post(purchaseHistory.addPurchaseHistory);

module.exports = router;
