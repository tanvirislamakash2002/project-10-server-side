import { ObjectId } from "mongodb";
import { dbService } from "../../services/database.service.js";
import { listingService } from "./listings.service.js";


const createNewListings = async (req, res) => {
    const data = req.body;
    const result = await listingService.createNewListings(data)
    res.send(result)
}

const getAllActiveListings = async (req, res) => {
    // const result = await listingService.getAllActiveListings()
    // res.send(result)
// ------------------------------
const listingCollection = dbService.listings;
      const {
    priceMin, priceMax, location, roomType, propertyType,
    gender, amenities, verifiedOnly, ageMin, ageMax,
    page = 1, limit = 20, sortBy = 'createdAt', order = 'desc'
  } = req.query;
  
  // Build MongoDB query
  const query = { status: 'accepted' };
  
  // Price filter
  if (priceMin || priceMax) {
    query['pricing.monthlyRent'] = {};
    if (priceMin) query['pricing.monthlyRent'].$gte = Number(priceMin);
    if (priceMax) query['pricing.monthlyRent'].$lte = Number(priceMax);
  }
  
  // Location filter (text search)
  if (location) {
    query.$or = [
      { 'location.address.city': new RegExp(location, 'i') },
      { 'location.address.state': new RegExp(location, 'i') },
      { 'location.address.street': new RegExp(location, 'i') },
      { 'location.neighborhood': new RegExp(location, 'i') }
    ];
  }
  
  // Room type filter
  if (roomType) {
    query.roomType = { $in: roomType.split(',') };
  }
  
  // Execute query with pagination
  const skip = (page - 1) * limit;
  const [listings, total] = await Promise.all([
    listingCollection.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(Number(limit))
      .toArray(),
    listingCollection.countDocuments(query)
  ]);
  
  res.json({
    success: true,
    data: listings,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
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