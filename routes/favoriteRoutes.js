const express = require('express');
const router = express.Router();

const {
  toggleFavorite,
  checkFavorite,
  getFavorites,
  deleteFavorite,
} = require('../controllers/favoriteController');



// Toggle
router.post('/favorites/toggle', toggleFavorite);

// Check
router.get('/favorites/check', checkFavorite);

// Get all favorites
router.get('/favorites', getFavorites);

// Delete one favorite by ID
router.delete('/favorites/:id', deleteFavorite);

// Delete favorite in a bulk
router.delete('/favorites/bulk', bulkRemoveFavorites);

module.exports = router;
