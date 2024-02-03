const express = require('express');

const router = express.Router();

const books = require('../controllers/book');
const adminAuth = require('../middlewares/adminAuth');
const { validateBookData } = require('../validators/book');

router.route('/createBook').post([validateBookData, adminAuth], books.createBook);
router.route('/updateBook').patch([adminAuth], books.updateBook);
router.route('/deleteBook').delete([adminAuth], books.deleteBook);
router.route('/getAllBooks').get(books.getAllBooks);
router.route('/getBookById').get(books.getBookById);
router.route('/purchaseBook').post(books.purchaseBook);
router.route('/updateSellCountOnPurchase').patch(books.updateSellCountOnPurchase);
router.route('searchBook').post(books.searchBook);
router.route('filterBook').post(books.filterBook);

module.exports = router;