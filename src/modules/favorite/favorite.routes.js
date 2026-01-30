import express from "express"
import { favoriteController } from "./favorite.controller.js";
const router = express.Router();

// Toggle
router.post('/toggle', favoriteController.toggleFavorite);

// Check
router.get('/check', favoriteController.checkFavorite);

// Get all favorites
router.get('', favoriteController.getFavorites);

// Delete favorite in a bulk
router.delete('/bulk', favoriteController.bulkRemoveFavorites);

// Delete one favorite by ID
router.delete('/:id', favoriteController.deleteFavorite);


export const favoriteRoutes = router;
