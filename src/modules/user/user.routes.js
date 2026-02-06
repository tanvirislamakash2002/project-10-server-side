import express from "express"
import { userController } from "./user.controller.js";
const router = express.Router();

// GET user role by email
router.get('/:email/role', userController.getUserRole);

// GET user by id 
router.get('/', userController.getUser);


export const userRoutes = router;