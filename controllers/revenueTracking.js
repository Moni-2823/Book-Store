const purchaseHistoryModel = require("../models/purchaseHistory");
const userModel = require("../models/user");
const constants = require("../config/constants");

const revenueTracking = async (req, res) => {
    try {
        // Fetch all authors
        const authors = await userModel.find({ role: 'Author' });
    
        // Calculate revenue for each author
        const revenueDetails = await Promise.all(authors.map(async (author) => {
          const authorId = author._id;
          const authorName = author.username;
    
          // Fetch purchase history for books authored by the current author
          const authorBooks = await purchaseHistoryModel.find({ userId: authorId });
          
          // Calculate revenue for the current author
          const authorRevenue = authorBooks.reduce((totalRevenue, purchase) => {
            return totalRevenue + (purchase.price * purchase.quantity);
          }, 0);
    
          // Send email notification to the author
          sendRevenueNotification(authorName, authorRevenue);
    
          return { authorName, authorRevenue };
        }));
    
        res.status(200).json({ revenueDetails });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}

module.exports = {
    revenueTracking
}