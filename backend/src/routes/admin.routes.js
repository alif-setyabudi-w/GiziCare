import express from "express";
import { getAllUsers, deleteUser } from "../controllers/admin.controller.js";
import { verifyToken, isAdmin, isAhliGiziOrAdmin } from "../middlewares/auth.middleware.js";
import { getDashboardStats } from '../controllers/admin.controller.js';

const router = express.Router();

// Allow both admin and ahli_gizi to get users list
router.get("/users", verifyToken, isAhliGiziOrAdmin, getAllUsers);
router.get('/stats', getDashboardStats);

// Allow ahli_gizi to delete user
router.delete("/users/:userId", verifyToken, isAhliGiziOrAdmin, deleteUser);

export default router;