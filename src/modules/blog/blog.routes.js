import express from 'express';
import { blogController } from './blog.controller.js';
const router = express.Router();

// Public routes
router.get('/', blogController.getAllBlogPosts);
router.get('/posts/:slug', blogController.getBlogPostBySlug);
router.get('/posts/:slug/related', blogController.getRelatedPosts);
router.get('/categories', blogController.getBlogCategories);
router.get('/popular', blogController.getPopularPosts);
router.post('/newsletter/subscribe', blogController.subscribeToNewsletter);

// Admin routes (you might want to add authentication middleware)
router.post('/posts', blogController.createBlogPost);

export const blogRoutes = router;