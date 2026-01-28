import express from 'express';
import { authController } from './auth.controller.js';
const router = express.Router();

// POST /register-user
router.post('/register-user', authController.registerUser);

// GET /check-user-email
router.get('/check-user-email', authController.checkUserEmail);

// login user
router.post('/login', authController.loginUser);

export const authRoutes = router;
