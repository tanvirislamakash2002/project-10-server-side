const { ObjectId } = require('mongodb');
const { client } = require('../config/db');
const db = client.db('ph-a12-db');

// Toggle
const toggleFavorite = async (req, res) => {
  try {
    const { userEmail, donationId } = req.body;

    // Validate ObjectId
    if (!ObjectId.isValid(donationId)) {
      return res.status(400).json({ message: 'Invalid donation ID' });
    }

    const _donationId = new ObjectId(donationId);

    const existing = await db.collection('favorites').findOne({ userEmail, donationId: _donationId });

    if (existing) {
      await db.collection('favorites').deleteOne({ _id: existing._id });
      return res.json({ message: 'Removed from favorites', isFavorite: false });
    } else {
      const newFavorite = {
        userEmail,
        donationId: _donationId,
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
    const { userEmail, donationId } = req.query;
    const favorite = await db.collection('favorites').findOne({ 
      userEmail, 
      donationId: new ObjectId(donationId) 
    });
    res.json({ isFavorite: !!favorite });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all favorites with donation data
const getFavorites = async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) return res.status(400).json({ message: 'Missing userEmail' });

    const favorites = await db.collection('favorites').aggregate([
      { $match: { userEmail } },
      {
        $lookup: {
          from: 'donations',
          localField: 'donationId',
          foreignField: '_id',
          as: 'donation'
        }
      },
      { $unwind: '$donation' },
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

module.exports = {
  toggleFavorite,
  checkFavorite,
  getFavorites,
  deleteFavorite,
};
