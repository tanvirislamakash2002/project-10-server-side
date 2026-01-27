import express from "express"
import { userController } from "./user.controller.js";
const router = express.Router();

// Import controllers
// const {
//     getUserByEmail,
//     getUserRole
// } = require('../controllers/userController');

// GET user by email 
router.get('/users/:email', userController.getUserByEmail);

// GET user role by email
router.get('/users/:email/role', userController.getUserRole);

export const userRouters = router;