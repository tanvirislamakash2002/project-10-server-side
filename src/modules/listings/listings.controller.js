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
    
    // Parse query parameters
    const {
      price_min, price_max, location, room_type, property_type,
      gender, amenities, verified_only, age_min, age_max,
      page = 1, limit = 20, sort_by = 'createdAt', sort_order = 'desc'
    } = req.query;
    
    console.log('🔍 Received query params:', req.query);
    
    // Build MongoDB query
    const query = { status: 'accepted' };
    
    // 1. PRICE FILTER - Handle STRING values in database
    if (price_min || price_max) {
      // Since rent is stored as string, use $expr for numeric comparison
      query.$expr = {
        $and: []
      };
      
      if (price_min) {
        query.$expr.$and.push({
          $gte: [
            { $toDouble: { $ifNull: ["$pricing.rent", "0"] } }, // Convert string to number
            Number(price_min)
          ]
        });
      }
      
      if (price_max) {
        query.$expr.$and.push({
          $lte: [
            { $toDouble: { $ifNull: ["$pricing.rent", "0"] } },
            Number(price_max)
          ]
        });
      }
    }
    
    // 2. LOCATION FILTER
    if (location && location.trim() !== '') {
      const searchRegex = new RegExp(location.trim(), 'i');
      query.$or = [
        { 'address.city': searchRegex },
        { 'address.state': searchRegex },
        { 'address.street': searchRegex }
      ];
    }
    
    // 3. ROOM TYPE FILTER - Case insensitive
    if (room_type && room_type.trim() !== '') {
      const roomTypes = room_type.split(',').map(t => t.trim());
      // Create case-insensitive regex for each type
      query.$or = roomTypes.map(type => ({
        roomType: new RegExp(`^${type}$`, 'i')
      }));
    }
    
    // 4. PROPERTY TYPE FILTER - Case insensitive
    if (property_type && property_type.trim() !== '') {
      const propertyTypes = property_type.split(',').map(t => t.trim());
      query.$or = propertyTypes.map(type => ({
        propertyType: new RegExp(`^${type}$`, 'i')
      }));
    }
    
    // 5. GENDER FILTER - Handle "No Preference" and case
    if (gender && gender !== 'any') {
      const genderRegex = new RegExp(`^${gender}$`, 'i');
      query.$or = [
        { preferredGender: genderRegex },
        { preferredGender: /^no preference$/i } // Also match "No Preference"
      ];
    }
    
    // 6. AMENITIES FILTER - Handle string comparison
    if (amenities && amenities.trim() !== '') {
      const amenityArray = amenities.split(',').map(a => a.trim());
      // Use $all for array contains all specified amenities
      query.amenities = { $all: amenityArray };
    }
    
    // 7. AGE RANGE FILTER - Handle STRING values in nested object
    if (age_min || age_max) {
      // Since age is stored as string in nested object
      const ageConditions = [];
      
      if (age_min) {
        ageConditions.push({
          $gte: [
            { $toDouble: { $ifNull: ["$preferredAgeRange.min", "0"] } },
            Number(age_min)
          ]
        });
      }
      
      if (age_max) {
        ageConditions.push({
          $lte: [
            { $toDouble: { $ifNull: ["$preferredAgeRange.max", "100"] } },
            Number(age_max)
          ]
        });
      }
      
      // Add to $expr if it exists, otherwise create it
      if (!query.$expr) {
        query.$expr = { $and: [] };
      }
      
      query.$expr.$and.push(...ageConditions);
    }
    
    // 8. VERIFIED FILTER - Skip since your data doesn't have this field
    // if (verified_only === 'true') {
    //   // Your data doesn't have verified field
    // }
    
    // Debug: Log the final query
    console.log('🔍 MongoDB Query:', JSON.stringify(query, null, 2));
    
    // Sorting
    const sortOption = {};
    const sortField = sort_by || 'createdAt';
    const sortDirection = sort_order === 'asc' ? 1 : -1;
    sortOption[sortField] = sortDirection;
    
    // Pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const [listings, total] = await Promise.all([
      listingCollection.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .toArray(),
      listingCollection.countDocuments(query)
    ]);
    
    console.log(`✅ Found ${listings.length} listings (total matching: ${total})`);
    
    res.json({
      success: true,
      data: listings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: Number(page) < Math.ceil(total / limit),
        hasPrev: Number(page) > 1
      }
    });
    
  } catch (error) {
    console.error('❌ Filter error:', error);
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