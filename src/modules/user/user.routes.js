import express from "express"
import { userController } from "./user.controller.js";
const router = express.Router();


// GET user by email 
router.get('/users/:email', userController.getUserByEmail);

// GET user role by email
router.get('/users/:email/role', userController.getUserRole);

export const userRoutes = router;