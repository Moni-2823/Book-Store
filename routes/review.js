const express = require('express');
const review = require('../controllers/review');

const router = express.Router();

router.route('/bookReview').get(review.bookReview);
router.route('/getAllReview').post(review.getAllReviews);

module.exports = router;
