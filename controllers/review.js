const reviewModel = require("../models/review");
const bookModel = require("../models/book");

const reviewBook = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const { userId, rating, reviewText } = req.body;

        // Check if the book exists
        const book = await bookModel.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Create a new review
        const newReview = new reviewModel({
            userId,
            bookId,
            rating,
            reviewText,
        });

        // Save the review to the database
        await newReview.save();

        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getAllReviews = async (req, res) => {
    try {
        const bookId = req.params.bookId;

        // Check if the book exists
        const book = await bookModel.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Get all reviews for the book
        const reviews = await reviewModel.find({ bookId });

        res.status(200).json({ reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    reviewBook,
    getAllReviews
};