const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userName: String,
  text: String,
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
});

module.exports = mongoose.model('Review', reviewSchema);
