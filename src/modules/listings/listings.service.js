import { dbService } from "../../services/database.service";

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

export const listingService = {
    createNewListings,
    getAllActiveListings,
    getSingleListings
}