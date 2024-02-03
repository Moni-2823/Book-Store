const mongoose = require('mongoose');

const sequenceValueSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequenceValue: { type: Number, default: 0 },
});

module.exports = mongoose.model('SequenceValue', sequenceValueSchema);