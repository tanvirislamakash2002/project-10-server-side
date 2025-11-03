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
router.get('/posts', getAllBlogPosts);
router.get('/posts/:slug', getBlogPostBySlug);
router.get('/posts/:slug/related', getRelatedPosts);
router.get('/categories', getBlogCategories);
router.get('/popular', getPopularPosts);
router.post('/newsletter/subscribe', subscribeToNewsletter);

// Admin routes (you might want to add authentication middleware)
router.post('/posts', createBlogPost);

module.exports = router;