import express from "express";
import { getNutritionData, searchNutritionData } from "../controllers/gizi.controller.js";

const router = express.Router();

// Get all nutrition data
router.get("/", getNutritionData);

// Search nutrition data
router.get("/search", searchNutritionData);

export default router;
