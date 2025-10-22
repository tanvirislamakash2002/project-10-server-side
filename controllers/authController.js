const { client } = require('../config/db');

const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const db = client.db('ph-a10-DB');
    const usersCollection = db.collection('users');

    // Update last login time:
    const result = await usersCollection.updateOne(
      { email },
      { $set: { lastLogin: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Login recorded', email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, photoURL, role } = req.body;

    const db = client.db('ph-a10-DB');
    const usersCollection = db.collection('users');

    const newUser = {
      name,
      email,
      photoURL: photoURL || "",
      role,
      createdAt: new Date(),
      createdAtString: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({
      success: true,
      userId: result.insertedId
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Database error" });
  }
};

const checkUserEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ exists: false, message: 'No email provided' });
    }

    const db = client.db('ph-a10-DB');
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });

    res.json({ exists: !!user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  checkUserEmail,
  loginUser,
};
