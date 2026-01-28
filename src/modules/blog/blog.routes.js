import express from 'express';
import { blogController } from './blog.controller.js';
const router = express.Router();

// Public routes
router.get('/blog/posts', blogController.getAllBlogPosts);
router.get('/blog/posts/:slug', blogController.getBlogPostBySlug);
router.get('/blog/posts/:slug/related', blogController.getRelatedPosts);
router.get('/blog/categories', blogController.getBlogCategories);
router.get('/blog/popular', blogController.getPopularPosts);
router.post('/blog/newsletter/subscribe', blogController.subscribeToNewsletter);

// Admin routes (you might want to add authentication middleware)
router.post('/posts', blogController.createBlogPost);

export const blogRoutes = router;