const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookId: { type: String, unique: true },
  author: [String],
  sellCount: Number,
  title: { type: String, unique: true },
  description: String,
  price: { type: Number, min: 100, max: 1000 },
  stock: { type: Number, min: 0, max: 100 },
},
{
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
