const express = require('express');
const router = express.Router();

const {
  getAllBlogPosts,
  getBlogPostBySlug,
  getRelatedPosts,
  getBlogCategories,
  getPopularPosts,
  createBlogPost,
  subscribeToNewsletter
} = require('../controllers/blogController');

// Public routes
router.get('/blog/posts', getAllBlogPosts);
router.get('/blog/posts/:slug', getBlogPostBySlug);
router.get('/blog/posts/:slug/related', getRelatedPosts);
router.get('/blog/categories', getBlogCategories);
router.get('/blog/popular', getPopularPosts);
router.post('/blog/newsletter/subscribe', subscribeToNewsletter);

// Admin routes (you might want to add authentication middleware)
router.post('/posts', createBlogPost);

module.exports = router;