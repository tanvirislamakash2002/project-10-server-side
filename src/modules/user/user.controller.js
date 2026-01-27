const { client } = require("../config/db");

// GET user by email
const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const db = client.db('ph-a10-DB');
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET user role
const getUserRole = async (req, res) => {
  const { email } = req.params;
  try {
    const db = client.db('ph-a10-DB');
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ role: user.role || 'user' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getUserByEmail,
  getUserRole
};