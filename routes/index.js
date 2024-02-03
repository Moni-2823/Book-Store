const express = require('express');

const user = require('./user');
const book = require('./book');
const purchaseHistory = require('./purchaseHistory');
const revenueTracking = require('./revenueTracking');

const router = express.Router();
router.use('/user', user);
router.use('/book', book);
router.use('/purchaseHistory', purchaseHistory);
router.use('/revenueTracking', revenueTracking);

module.exports = router;
