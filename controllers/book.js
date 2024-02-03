const bookModel = require("../models/book");

const createBook = async (req, res) => {
    try {
        const { author, title, description, price } = req.body;
        // Ensure the title can be used as a slug for the book URL
        const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
        // Validate the price within the specified range
        if (price < 100 || price > 1000) {
            return res.status(400).json({ message: 'Invalid price range' });
        }
        // Create a new book
        const newBook = new bookModel({
            author,
            title,
            description,
            price,
            sellCount: 0, // Initializing sellCount to zero
        });
        // Save the book to the database
        await newBook.save();
        res.status(201).json({ message: 'Book added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getAllBooks = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const books = await bookModel.find()
            .limit(limit)
            .skip((page - 1) * limit)
            .exec();

        const totalCount = await bookModel.countDocuments();

        res.status(200).send({
            statuscode: 200,
            message: "Books fetched successfully",
            data: books,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).send({ statuscode: 500, message: error.message });
    }
}

const getBookById = async (req, res) => {
    try {
        const _id = req.params.id;
        const book = await bookModel.findOne({ _id });
        res.status(200).send({ statuscode: 200, message: "book fetched successfully", data: book });
    } catch (error) {
        res.status(500).send({ statuscode: 500, message: error.message });
    }
}

const deleteBook = async (req, res) => {
    try {
        const _id = req.params.id;
        const book = await bookModel.findByIdAndDelete({ _id });
        res.status(200).send({ statuscode: 200, message: "book deleted successfully", data: book });
    }
    catch (error) {
        res.status(500).send({ statuscode: 500, message: error.message });
    }
}

const updateBook = async (req, res) => {
    try {
        const { _id, title, author, description, price } = req.body;
        const book = await bookModel.findByIdAndUpdate(
            { _id },
            { title, author, description, price },
            { new: true });
        res.status(200).send({ statuscode: 200, message: "book updated successfully", data: book });
    }
    catch (error) {
        res.status(500).send({ statuscode: 500, message: error.message });
    }
}

const purchaseBook = async (req, res) => {
    try {
        const _id = req.params.bookId;
        const { userId, quantity } = req.body;

        // Fetch book details from the database
        const book = await bookModel.findOne({ _id });

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Calculate the total amount based on the book price and quantity
        const totalAmount = book.price * quantity;

        // Create a payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount * 100, // Convert to cents
            currency: 'usd',
        });

        // Record the purchase in the database
        const purchase = new purchaseHistoryModel({
            purchaseId: await generatePurchaseId(),
            bookId,
            userId,
            purchaseDate: new Date(),
            price: book.price,
            quantity,
        });
        // Decrease the stock by 1
        book.stock -= quantity;
        await book.save();

        await purchase.save();

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Function to generate a unique purchaseId
async function generatePurchaseId() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');

    // Use findOneAndUpdate to get a unique increment id
    const result = await purchaseHistoryModel.findOneAndUpdate(
        { _id: 'purchaseIdCounter' },
        { $inc: { sequenceValue: 1 } },
        { upsert: true, new: true }
    );

    const incrementId = result.sequenceValue;

    return `${year}-${month}-${incrementId}`;
}

const updateSellCountOnPurchase = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const { userId, price, quantity } = req.body;

        // Create a new purchase history entry
        const newPurchase = new purchaseHistoryModel({
            purchaseId: generatePurchaseId(), // Function to generate a unique purchaseId
            bookId,
            userId,
            purchaseDate: new Date(),
            price,
            quantity,
        });

        // Save the purchase history entry to the database
        await newPurchase.save();

        // Update the sellCount for the book
        await bookModel.findOneAndUpdate({ bookId }, { $inc: { sellCount: quantity } });

        res.status(201).json({ message: 'Purchase recorded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const searchBook = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Query parameter is required for search' });
        }

        const books = await bookModel.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
            ],
        });

        res.status(200).json({ books });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const filterBook = async (req, res) => {
    try {
        let filterCriteria = {};

        if (req.query.author) {
            filterCriteria.author = { $in: [req.query.author] };
        }

        if (req.query.minPrice && req.query.maxPrice) {
            filterCriteria.price = { $gte: Number(req.query.minPrice), $lte: Number(req.query.maxPrice) };
        }

        if (req.query.minSellCount && req.query.maxSellCount) {
            filterCriteria.sellCount = { $gte: Number(req.query.minSellCount), $lte: Number(req.query.maxSellCount) };
        }

        const books = await bookModel.find(filterCriteria);

        res.status(200).json({ books });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Function to generate a unique purchaseId
async function generatePurchaseId() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');

    // Use findOneAndUpdate to get a unique increment id
    const result = await purchaseHistoryModel.findOneAndUpdate(
        { _id: 'purchaseIdCounter' },
        { $inc: { sequenceValue: 1 } },
        { upsert: true, new: true }
    );

    const incrementId = result.sequenceValue;

    return `${year}-${month}-${incrementId}`;
}

module.exports = {
    createBook,
    getAllBooks,
    deleteBook,
    getBookById,
    updateBook,
    purchaseBook,
    updateSellCountOnPurchase,
    searchBook,
    filterBook
}