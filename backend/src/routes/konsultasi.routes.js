import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  submitKonsultasi,
  getKonsultasi,
  getKonsultasiDetail,
  updateKonsultasi,
  deleteKonsultasi,
  getUserKonsultasi,
} from "../controllers/konsultasi.controller.js";

const router = express.Router();

// POST - User submit konsultasi
router.post("/", verifyToken, submitKonsultasi);

// GET - Petugas lihat semua konsultasi (dengan filter status)
router.get("/", verifyToken, getKonsultasi);

// GET - User lihat konsultasi mereka
router.get("/user/:userId", verifyToken, getUserKonsultasi);

// GET - Detail konsultasi
router.get("/:id", verifyToken, getKonsultasiDetail);

// PUT - Petugas update/respons konsultasi
router.put("/:id", verifyToken, updateKonsultasi);

// DELETE - Hapus konsultasi
router.delete("/:id", verifyToken, deleteKonsultasi);

export default router;
