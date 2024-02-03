const mongoose = require('mongoose');

const purchaseHistorySchema = new mongoose.Schema({
  purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'SequenceValue' },
  bookId: String,
  userId: String,
  purchaseDate: Date,
  price: Number,
  quantity: Number,
},
{
  timestamps: true
});

module.exports = mongoose.model('PurchaseHistory', purchaseHistorySchema);
