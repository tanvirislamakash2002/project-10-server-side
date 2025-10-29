const { ObjectId } = require('mongodb');
const { client } = require('../config/db');
const db = client.db('ph-a10-DB');

// Toggle
const toggleFavorite = async (req, res) => {
  try {
    const { userEmail, listingId } = req.body;

    // Validate ObjectId
    if (!ObjectId.isValid(listingId)) {
      return res.status(400).json({ message: 'Invalid donation ID' });
    }

    const _listingId = new ObjectId(listingId);

    const existing = await db.collection('favorites').findOne({ userEmail, listingId: _listingId });

    if (existing) {
      await db.collection('favorites').deleteOne({ _id: existing._id });
      return res.json({ message: 'Removed from favorites', isFavorite: false });
    } else {
      const newFavorite = {
        userEmail,
        listingId: _listingId,
        createdAt: new Date(),
      };
      await db.collection('favorites').insertOne(newFavorite);
      return res.json({ message: 'Added to favorites', isFavorite: true });
    }
  } catch (err) {
    console.error('Toggle error:', err.message);
    res.status(500).json({ message: err.message });
  }
};


// Check
const checkFavorite = async (req, res) => {
  try {
    const { userEmail, listingId } = req.query;
    const favorite = await db.collection('favorites').findOne({ 
      userEmail, 
      listingId: new ObjectId(listingId) 
    });
    res.json({ isFavorite: !!favorite });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all favorites with listings data
const getFavorites = async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) return res.status(400).json({ message: 'Missing userEmail' });

    const favorites = await db.collection('favorites').aggregate([
      { $match: { userEmail } },
      {
        $lookup: {
          from: 'listings',
          localField: 'listingId',
          foreignField: '_id',
          as: 'listing'
        }
      },
      { $unwind: '$listing' },
    { $sort: { _id: -1 } },
    ]).toArray();
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove single favorite by ID
const deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('favorites').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Favorite removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove favorite in a bulk
const bulkRemoveFavorites = async (req, res) => {
  try {
    const { favoriteIds } = req.body;
    
    if (!favoriteIds || !Array.isArray(favoriteIds)) {
      return res.status(400).json({ message: 'Invalid favorite IDs' });
    }

    const result = await db.collection('favorites').deleteMany({
      _id: { $in: favoriteIds.map(id => new ObjectId(id)) }
    });

    res.json({ 
      message: `Removed ${result.deletedCount} favorites`,
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  toggleFavorite,
  checkFavorite,
  getFavorites,
  deleteFavorite,
  bulkRemoveFavorites
};
