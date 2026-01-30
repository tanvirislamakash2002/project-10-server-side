import express from "express"
import { userController } from "./user.controller.js";
const router = express.Router();


// GET user by email 
router.get('/:email', userController.getUserByEmail);

// GET user role by email
router.get('/:email/role', userController.getUserRole);

export const userRoutes = router;