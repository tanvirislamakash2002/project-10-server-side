import { ObjectId } from "mongodb";
import { dbService } from "../../services/database.service.js";
import { listingService } from "./listings.service.js";


const createNewListings = async (req, res) => {
    const data = req.body;
    const result = await listingService.createNewListings(data)
    res.send(result)
}

const getAllActiveListings = async (req, res) => {

 try {
    const listingCollection = dbService.listings;
    
    // Log received parameters
    console.log('🔍 Received query params:', req.query);
    
    // Get listings using service layer
    const { listings, total, pagination } = await listingService.getAllListings(
      listingCollection,
      req.query
    );
    
    // Log query results
    console.log(` Found ${listings.length} listings (total matching: ${total})`);
    
    // Send response
    res.json({
      success: true,
      data: listings,
      pagination
    });
    
  } catch (error) {
    console.error(' Filter error:', error);
    res.status(500).json({
      success: false,
      message: 'Error filtering listings',
      error: error.message
    });
  }
}

const getSingleListings = async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await listingService.getSingleListings(query)
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
    const result = await listingService.updateListings(filter, updatedDoc, options)

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