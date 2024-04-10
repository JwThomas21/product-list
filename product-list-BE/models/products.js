const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  categories: String,
  name: String,
  price: Number,
  image: String,
  reviews:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

module.exports = mongoose.model("Product", ProductSchema);
