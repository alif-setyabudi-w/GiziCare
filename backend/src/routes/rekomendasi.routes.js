import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getRekomendasi,
  getKaloriKebutuhan,
  saveRekomendasiReport,
  getLaporanList,
  getLaporanDetail,
  deleteLaporanDetail,
  getUserLatestRekomendasi,
  getUserRekomendasiList,
  getUserRekomendasiDetail,
  getNutritionRecommendations,
  getNutritionProfile,
  predictFood,
  getAvailableLaporanForUser,
  giveRekomendasiToUser,
} from "../controllers/rekomendasi.controller.js";

const router = express.Router();

// POST - Get recommendations
router.post("/", getRekomendasi);

// GET - Calculate daily calorie needs
router.get("/kalori-kebutuhan", getKaloriKebutuhan);

// POST - Save rekomendasi to database (laporan) - Requires authentication
router.post("/save-report", verifyToken, saveRekomendasiReport);

// GET - List laporan rekomendasi - Requires authentication
router.get("/laporan", verifyToken, getLaporanList);

// GET - Detail laporan rekomendasi with foods - Requires authentication
router.get("/laporan/:id", verifyToken, getLaporanDetail);

// DELETE - Delete laporan rekomendasi - Requires authentication
router.delete("/laporan/:id", verifyToken, deleteLaporanDetail);

// GET - Get user's latest rekomendasi - Requires authentication
router.get("/user/latest", verifyToken, getUserLatestRekomendasi);

// GET - Get list rekomendasi untuk user - Requires authentication
router.get("/user/list", verifyToken, getUserRekomendasiList);

// GET - Get detail rekomendasi untuk user - Requires authentication
router.get("/user/detail/:id", verifyToken, getUserRekomendasiDetail);

// GET - Get available laporan untuk diberikan ke user - Requires authentication
router.get("/available/:userId", verifyToken, getAvailableLaporanForUser);

// POST - Give rekomendasi to user - Requires authentication
router.post("/:rekoId/give-to-user/:userId", verifyToken, giveRekomendasiToUser);

// ===== KNN/ML Service Proxy Endpoints =====
// POST - Get nutrition recommendations from ML Service
router.post("/knn/recommend", getNutritionRecommendations);

// POST - Get nutritional profile analysis from ML Service
router.post("/knn/profile", getNutritionProfile);

// POST - Predict food from ML Service
router.post("/knn/predict", predictFood);

export default router;
