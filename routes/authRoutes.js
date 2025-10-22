// routes/authRoutes.js

const express = require('express');
const router = express.Router();

const { registerUser, checkUserEmail, loginUser } = require('../controllers/authController');

// POST /register-user
router.post('/register-user', registerUser);

// GET /check-user-email
router.get('/check-user-email', checkUserEmail);

// login user
router.post('/login', loginUser);

module.exports = router;
