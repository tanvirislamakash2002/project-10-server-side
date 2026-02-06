import { client } from "../../../config/db.js";


// GET user by email
const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const db = client.db('ph-a10-DB');
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(200).json({
      success: false,
      message: 'User not found'
    });

    res.status(200).json({ success: true, user });
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

    if (!user) {
      return res.status(200).json({
        role: 'user',
        isNewUser: true
      });
    }

    res.status(200).json({
      role: user.role || 'user',
      isNewUser: false
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const userController = {
  getUserByEmail,
  getUserRole
};