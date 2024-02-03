const purchaseHistoryModel = require("../models/purchaseHistory");
const constants = require("../config/constants");

// get purchase history
const purchaseHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
    
        // Fetch purchase history for the given user
        const purchaseHistory = await purchaseHistoryModel.find({ userId });
    
        res.status(200).json({ purchaseHistory });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
      }
}

// add purchase history
const addPurchaseHistory = async (req, res) => {
    try {
        const { bookId, userId, price, quantity } = req.body;
    
        // Create a new purchase history entry
        const newPurchase = new purchaseHistoryModel({
          bookId,
          userId,
          purchaseDate: new Date(),
          price,
          quantity,
        });
    
        await newPurchase.save();
        res.status(201).json({ message: 'Purchase history entry added successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
};

module.exports = {
    purchaseHistory,
    addPurchaseHistory
};