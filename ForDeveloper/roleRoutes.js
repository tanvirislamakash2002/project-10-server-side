const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Remove these lines - we'll get the database from the main app
// const { MongoClient, ObjectId } = require('mongodb');
// const uri = process.env.MONGODB_URI;
// const client = new MongoClient(uri);

// Update user role (for developers only)
router.patch('/update-role', async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    // Validate required fields
    if (!userId || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID and role are required' 
      });
    }

    // Validate role
    const validRoles = ['user', 'seeker', 'provider', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid role. Must be one of: user, seeker, provider, admin' 
      });
    }

    // Get database from app (we'll set this up in index.js)
    const db = req.app.get('db');
    const userCollection = db.collection('users');

    // Update only if user is a developer
    const result = await userCollection.updateOne(
      { 
        _id: new ObjectId(userId), 
        developer: 'true' // Only allow role change for developers
      },
      { 
        $set: { 
          role: role, 
          updatedAt: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found or not authorized to change roles' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: { role }
    });

  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get current user role (optional - for verification)
router.get('/current-role/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get database from app
    const db = req.app.get('db');
    const userCollection = db.collection('users');

    const user = await userCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { role: 1, developer: 1, email: 1 } }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: {
        role: user.role,
        developer: user.developer,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;