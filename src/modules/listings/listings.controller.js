import { ObjectId } from "mongodb";
import { dbService } from "../../services/database.service.js";
import { listingService } from "./listings.service.js";


const createNewListings = async (req, res) => {
    const data = req.body;
    const result = await listingService.createNewListings(data)
    res.send(result)
}

const getAllActiveListings = async (req, res) => {
    const result = await listingService.getAllActiveListings()
    res.send(result)
}

const getSingleListings = async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const listingCollection = dbService.listings;

    const result = await listingCollection.findOne(query)
    res.send(result)
}

const updateListings = async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
    const options = { upsert: true }
    const updatedData = req.body;
    const updatedDoc = {
        $set: updatedData
    }
    const listingCollection = dbService.listings;

    const result = await listingCollection.updateOne(filter, updatedDoc, options)

    res.send(result)
}

const deleteListings = async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const listingCollection = dbService.listings;

    const result = await listingCollection.deleteOne(query);
    res.send(result)
}

export const listingController = {
    createNewListings,
    getAllActiveListings,
    getSingleListings,
    updateListings,
    deleteListings,
}