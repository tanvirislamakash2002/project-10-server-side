import { client } from "../../../config/db.js";
import { authMiddleware } from "../../middleware/auth.js";
import { dbService } from "../../services/database.service.js";
import { authServices } from "./auth.service.js";


const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await authServices.checkUserEmail(email)
    if (user) {
      const token = authMiddleware.generateToken(user._id, email, user.role)
      const result = await authServices.loginUser(email);

      res.status(200).json({
        success:true,
        message: 'Login recorded',
        token,
        result
      });

    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

  } catch (err) {
    res.status(500).json({
      message: err.message,
      details:err
    });
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
      return res.status(400).json({
        exists: false,
        message: 'No email provided'
      });
    }

    const user = await authServices.checkUserEmail(email)

    res.status(200).json({
      exists: !!user,
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const authController = {
  registerUser,
  checkUserEmail,
  loginUser,
};
