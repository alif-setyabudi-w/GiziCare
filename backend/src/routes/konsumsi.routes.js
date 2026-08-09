import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  addKonsumsi,
  getKonsumsiByUser,
  getAllKonsumsi,
  updateKonsumsi,
  deleteKonsumsi,
} from "../controllers/konsumsi.controller.js";

const router = express.Router();

// POST - User tambah entri konsumsi
router.post("/", verifyToken, addKonsumsi);

// GET - Petugas lihat semua konsumsi (semua user, bisa filter)
router.get("/", verifyToken, getAllKonsumsi);

// GET - User/Petugas lihat konsumsi berdasarkan user
router.get("/user/:userId", verifyToken, getKonsumsiByUser);

// PUT - User edit entri konsumsi miliknya
router.put("/:id", verifyToken, updateKonsumsi);

// DELETE - User/Petugas hapus entri konsumsi
router.delete("/:id", verifyToken, deleteKonsumsi);

export default router;
