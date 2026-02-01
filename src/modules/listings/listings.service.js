import { dbService } from "../../services/database.service";

const createNewListings = async (data) => {
    const listingCollection = dbService.listings;
    const result = await listingCollection.insertOne(data)
    return result
}

export const listingService = {
    createNewListings
}