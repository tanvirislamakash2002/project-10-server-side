const express = require('express');
const router = express.Router();

// Import controllers
const {
    getUserByEmail,
    getUserRole
} = require('../controllers/userController');

// GET user by email 
router.get('/users/:email', getUserByEmail);

// GET user role by email
router.get('/users/:email/role', getUserRole);

module.exports = router;