import { dbService } from "../../services/database.service.js";

const createNewListings = async (data) => {
    const listingCollection = dbService.listings;
    const result = await listingCollection.insertOne(data)
    return result
}

const getAllActiveListings = async () => {
    const listingCollection = dbService.listings;
    const result = await listingCollection.find().toArray()
    return result
}

const getSingleListings = async (query) => {
    const listingCollection = dbService.listings;
    const result = await listingCollection.findOne(query)
    return result
}

const updateListings = async (filter, updatedDoc, options) => {
    const listingCollection = dbService.listings;
    const result = await listingCollection.updateOne(filter, updatedDoc, options)
    res.send(result)
}

export const listingService = {
    createNewListings,
    getAllActiveListings,
    getSingleListings,
    updateListings
}