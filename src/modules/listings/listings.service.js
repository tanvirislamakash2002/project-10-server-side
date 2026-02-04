import { dbService } from "../../services/database.service.js";
import { getDateRangeFromTimeline } from "../../utils/dateUtils.js";

const createNewListings = async (data) => {
    const listingCollection = dbService.listings;
    const result = await listingCollection.insertOne(data)
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

const buildFilterQuery = (queryParams) => {
    const {
        price_min, price_max, location, moveInTimeline, room_type, property_type,
        gender, amenities, age_min, age_max
    } = queryParams;

    const query = { status: 'accepted' };

    // Price Filter
    if (price_min || price_max) {
        query.$expr = { $and: [] };

        if (price_min) {
            query.$expr.$and.push({
                $gte: [
                    { $toDouble: { $ifNull: ["$pricing.rent", "0"] } },
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

    // Location Filter
    if (location && location.trim() !== '') {
        const searchRegex = new RegExp(location.trim(), 'i');
        query.$or = [
            { 'address.city': searchRegex },
            { 'address.state': searchRegex },
            { 'address.street': searchRegex }
        ];
    }
    // Date availability filter
    if (moveInTimeline && moveInTimeline !== 'flexible') {
        const dateRange = getDateRangeFromTimeline(moveInTimeline);

        const startStr = dateRange.start.toISOString().split('T')[0];
        const endStr = dateRange.end.toISOString().split('T')[0];

        if (dateRange) {
            query.availableFrom = {
                $lte: endStr,
                $gte: startStr
            };


        }
    }

    // Room Type Filter
    if (room_type && room_type.trim() !== '') {
        const roomTypes = room_type.split(',').map(t => t.trim());
        query.$or = query.$or || [];
        query.$or.push(...roomTypes.map(type => ({
            roomType: new RegExp(`^${type}$`, 'i')
        })));
    }

    // Property Type Filter
    if (property_type && property_type.trim() !== '') {
        const propertyTypes = property_type.split(',').map(t => t.trim());
        query.$or = query.$or || [];
        query.$or.push(...propertyTypes.map(type => ({
            propertyType: new RegExp(`^${type}$`, 'i')
        })));
    }

    // Gender Filter
    if (gender && gender !== 'any') {
        const genderRegex = new RegExp(`^${gender}$`, 'i');
        query.$or = query.$or || [];
        query.$or.push(
            { preferredGender: genderRegex },
            { preferredGender: /^no preference$/i }
        );
    }

    // Amenities Filter
    if (amenities && amenities.trim() !== '') {
        const amenityArray = amenities.split(',').map(a => a.trim());
        query.amenities = { $in: amenityArray };
    }

    // Age Range Filter
    if (age_min || age_max) {
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

        if (ageConditions.length > 0) {
            if (!query.$expr) {
                query.$expr = { $and: [] };
            }
            query.$expr.$and.push(...ageConditions);
        }
    }

    return query;
};

const buildSortOptions = (sort_by = 'createdAt', sort_order = 'desc') => {
    const sortOption = {};
    const sortDirection = sort_order === 'asc' ? 1 : -1;
    sortOption[sort_by] = sortDirection;
    return sortOption;
};

const calculatePagination = (page = 1, limit = 20, total) => {
    const currentPage = Number(page);
    const pageSize = Number(limit);
    const totalPages = Math.ceil(total / pageSize);

    return {
        page: currentPage,
        limit: pageSize,
        skip: (currentPage - 1) * pageSize,
        total,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
    };
};

const getAllListings = async (listingCollection, queryParams) => {
    const {
        page = 1,
        limit = 20,
        sort_by = 'createdAt',
        sort_order = 'desc'
    } = queryParams;

    // Build query
    const query = buildFilterQuery(queryParams);

    // Build sort options
    const sortOption = buildSortOptions(sort_by, sort_order);

    // Execute queries
    const [listings, total] = await Promise.all([
        listingCollection.find(query)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .toArray(),
        listingCollection.countDocuments(query)
    ]);

    // Calculate pagination
    const pagination = calculatePagination(page, limit, total);

    return {
        listings,
        total,
        pagination
    };
};

export const listingService = {
    createNewListings,
    getAllListings,
    getSingleListings,
    updateListings
}