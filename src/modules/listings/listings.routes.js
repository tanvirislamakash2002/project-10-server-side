import express from "express"
import { listingController } from "./listings.controller.js";

const router = express.Router();

router.post('/', listingController.createNewListings)

router.get('/', listingController.getAllActiveListings)

router.get('/:id', listingController.getSingleListings)

router.put('/:id', listingController.updateListings)

router.delete('/:id', listingController.deleteListings)

export const listingsRoutes = router