const express = require('express');
const router = express.Router();

const {
  toggleFavorite,
  checkFavorite,
  getFavorites,
  deleteFavorite,
} = require('../controllers/favoriteController');

// Import middlewares
const verifyJWT = require('../middlewares/verifyJWT');

// Toggle
router.post('/favorites/toggle',verifyJWT, toggleFavorite);

// Check
router.get('/favorites/check',verifyJWT, checkFavorite);

// Get all favorites
router.get('/favorites', verifyJWT, getFavorites);

// Delete one favorite by ID
router.delete('/favorites/:id', verifyJWT, deleteFavorite);

module.exports = router;
