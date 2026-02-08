import { client } from "../../../config/db.js";
import { authMiddleware } from "../../middleware/auth.js";
import { dbService } from "../../services/database.service.js";


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

    if (!email || !name) {
      return res.status(400).json({ error: "Missing required fields" })
    }


    const usersCollection = dbService.users
    const findUser = await usersCollection.findOne({ email })

    const newUser = {
      name,
      email,
      photoURL: photoURL || "",
      role,
      createdAt: new Date(),
      createdAtString: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    if (!findUser) {

      const result = await usersCollection.insertOne(newUser);
      const token = authMiddleware.generateToken(result.insertedId, email, role)
      res.status(201).json({
        success: true,
        token,
        userId: result.insertedId
      });
    } else {
      res.status(404).json({
        success: false,
        result: 'user already exist'
      });

    }

  } catch (err) {

    res.status(500).json({ message: err.message, details: err });
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

export const authController = {
  registerUser,
  checkUserEmail,
  loginUser,
};
