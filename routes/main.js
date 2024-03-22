const express = require('express');
const router = express.Router();
const Product = require('../models/products');
const Review = require('../models/reviews');

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
  const page = parseInt(req.query.page) || 1;
  const limit = 4;
  const skip = (page - 1) * limit;

  try {
    const product = await Product.findById(productId).populate({
      path: 'reviews',
      options: { limit, skip }
    });

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

// GET products with optional category filter and sorting by price
router.get('/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10; // Assuming you want to limit to 10 products per page
  const skip = (page - 1) * limit;

  try {
    let query = {};

    // Check if category query parameter exists
    if (req.query.category) {
      query.category = req.query.category;
    }

    let sortOption = {};

    // Check if price query parameter exists
    if (req.query.price) {
      if (req.query.price === 'highest') {
        sortOption.price = -1; // Sort by price from highest to lowest
      } else if (req.query.price === 'lowest') {
        sortOption.price = 1; // Sort by price from lowest to highest
      }
    }

    const products = await Product.find(query)
      .limit(limit)
      .skip(skip)
      .sort(sortOption);

    res.send(products);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
