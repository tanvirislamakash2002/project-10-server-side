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

// Build MongoDB query - match your database structure
const query = { status: 'accepted' };

// 1. PRICE FILTER (rent, not monthlyRent)
if (priceMin || priceMax) {
  query['pricing.rent'] = {};
  if (priceMin) query['pricing.rent'].$gte = Number(priceMin);
  if (priceMax) query['pricing.rent'].$lte = Number(priceMax);
}

// 2. LOCATION FILTER (address, not location.address)
if (location) {
  query.$or = [
    { 'address.city': new RegExp(location, 'i') },
    { 'address.state': new RegExp(location, 'i') },
    { 'address.street': new RegExp(location, 'i') }
  ];
}

// 3. ROOM TYPE FILTER
if (roomType) {
  // Convert comma-separated string to array
  const roomTypes = roomType.split(',');
  query.roomType = { $in: roomTypes };
}

// 4. PROPERTY TYPE FILTER !
if (propertyType) {
  const propertyTypes = propertyType.split(',');
  query.propertyType = { $in: propertyTypes };
}

// 5. GENDER FILTER !
if (gender && gender !== 'any') {
  query.preferredGender = gender; 
  // query.$or = [
  //   { preferredGender: gender },
  //   { preferredGender: 'No Preference' }
  // ];
}

// 6. AMENITIES FILTER !
if (amenities) {
  const amenityArray = amenities.split(',');
  query.amenities = { $all: amenityArray };
}

// 7. AGE RANGE FILTER !
if (ageMin || ageMax) {
  query['preferredAgeRange'] = {};
  if (ageMin) query['preferredAgeRange'].$gte = Number(ageMin);
  if (ageMax) query['preferredAgeRange'].$lte = Number(ageMax);
}

// 8. VERIFIED FILTER !
// Note: Your data doesn't have verified field!
// You might need to add this field or adjust logic
if (verifiedOnly === 'true') {
  // query['provider.verified'] = true;

  // query['poster.verified'] = true;
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