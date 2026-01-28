import express from "express"
import { roleController } from "./role.controller.js";

const router = express.Router();

// Update user role (for developers only)
router.patch('/update-role', roleController.updateUserRole);

// Get current user role (optional - for verification)
router.get('/current-role/:userId', roleController.getCurrentUserRole);

export const roleRoutes = router;