import express from "express"
import { favoriteController } from "./favorite.controller.js";
const router = express.Router();

// Toggle
router.post('/favorites/toggle', favoriteController.toggleFavorite);

// Check
router.get('/favorites/check', favoriteController.checkFavorite);

// Get all favorites
router.get('/favorites', favoriteController.getFavorites);

// Delete favorite in a bulk
router.delete('/favorites/bulk', favoriteController.bulkRemoveFavorites);

// Delete one favorite by ID
router.delete('/favorites/:id', favoriteController.deleteFavorite);


export const favoriteRoutes = router;
