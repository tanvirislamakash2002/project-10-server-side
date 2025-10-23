const express = require('express');
const router = express.Router();

// Import controllers
const {
    getUserRole
} = require('../controllers/userController');

// GET user role by email
router.get('/users/:email/role', getUserRole);

module.exports = router;