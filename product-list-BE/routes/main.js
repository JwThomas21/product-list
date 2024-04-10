const express = require('express');
const router = express.Router();
const Product = require('../models/products');
const Review = require('../models/reviews');

// GET all products with pagination
router.get('/', async (req, res) => {
  try {
    let { page, limit, name, category, price } = req.query;

    // Convert page and limit to numbers
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // Calculate the skip value based on page and limit
    const skip = (page - 1) * limit;

    let query = {};

    // Check if name query parameter exists
    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    // Check if category query parameter exists
    if (category) {
      query.category = category; 
    }

    let sortOption = {};

    // Check if price query parameter exists
    if (price) {
      if (price === 'highest') {
        sortOption.price = -1; // Sort by price from highest to lowest
      } else if (price === 'lowest') {
        sortOption.price = 1; // Sort by price from lowest to highest
      }
    }

    const products = await Product.find(query)
                                  .sort(sortOption)
                                  .skip(skip)
                                  .limit(limit);

    const totalProducts = await Product.countDocuments(query); // Count total number of products

    const totalPages = Math.ceil(totalProducts / limit); // Calculate total number of pages

    res.send({ products, totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// GET a specific product by its id
router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate('reviews');
    if (!product) return res.status(404).send('Product not found');
    res.send(product);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// GET all reviews for a product, paginated
router.get('/:productId/reviews', async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId).populate('reviews');
    if (!product) return res.status(404).send('Product not found');

    res.send(product.reviews);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// POST - Create a new product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.send(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// POST - Create a new review for a product
router.post('/:productId/reviews', async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send('Product not found');

    const review = new Review(req.body);
    review.product = productId;
    await review.save();

    product.reviews.push(review);
    await product.save();

    res.send(review);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// DELETE - Delete a product
router.delete('/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    await Product.findByIdAndDelete(productId);
    res.send('Product deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// DELETE - Delete a review
router.delete('/reviews/:reviewId', async (req, res) => {
  const { reviewId } = req.params;
  try {
    await Review.findByIdAndDelete(reviewId);
    res.send('Review deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
