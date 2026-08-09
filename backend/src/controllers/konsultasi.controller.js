import db from "../config/db.js";

/**
 * POST /api/konsultasi
 * User mengirim konsultasi ke petugas
 * Jika user sudah memiliki konsultasi pending/diproses, akan di-update bukan membuat baru
 */
export const submitKonsultasi = async (req, res) => {
  try {
    const {
      user_id,
      nama,
      email,
      usia,
      jenis_kelamin,
      berat,
      tinggi,
      aktivitas,
      tujuan,
      kategori,
      catatan,
    } = req.body;

    // Validasi input
    if (!user_id || !nama || !email || !usia || !jenis_kelamin || !berat || !tinggi || !aktivitas || !tujuan) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi",
      });
    }

    // Cek apakah user sudah memiliki konsultasi pending atau diproses
    const [existingKonsultasi] = await db.query(
      `SELECT id FROM konsultasi WHERE user_id = ? AND (status = 'pending' OR status = 'diproses')`,
      [user_id]
    );

    if (existingKonsultasi.length > 0) {
      // Update existing konsultasi dengan data terbaru
      const konsultasiId = existingKonsultasi[0].id;
      await db.query(
        `UPDATE konsultasi 
         SET nama = ?, email = ?, usia = ?, jenis_kelamin = ?, berat = ?, tinggi = ?, 
             aktivitas = ?, tujuan = ?, kategori = ?, catatan = ?, updated_at = NOW() 
         WHERE id = ?`,
        [
          nama,
          email,
          usia,
          jenis_kelamin,
          berat,
          tinggi,
          aktivitas,
          tujuan,
          kategori || "all",
          catatan || null,
          konsultasiId,
        ]
      );

      return res.json({
        success: true,
        message: "Konsultasi berhasil diperbarui",
        data: {
          id: konsultasiId,
          user_id,
          status: "pending",
        },
      });
    }

    // Jika tidak ada konsultasi pending, buat yang baru
    const [result] = await db.query(
      `INSERT INTO konsultasi 
      (user_id, nama, email, usia, jenis_kelamin, berat, tinggi, aktivitas, tujuan, kategori, catatan, status, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        user_id,
        nama,
        email,
        usia,
        jenis_kelamin,
        berat,
        tinggi,
        aktivitas,
        tujuan,
        kategori || "all",
        catatan || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Konsultasi berhasil dikirim ke petugas",
      data: {
        id: result.insertId,
        user_id,
        status: "pending",
      },
    });
  } catch (error) {
    console.error("[Konsultasi Controller] Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengirim konsultasi",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * GET /api/konsultasi
 * Petugas melihat daftar konsultasi (dengan filter status)
 */
export const getKonsultasi = async (req, res) => {
  try {
    const { status = "all" } = req.query;

    let query = "SELECT * FROM konsultasi WHERE 1=1";
    const params = [];

    if (status !== "all") {
      query += " AND status = ?";
      params.push(status);
    }

    query += " ORDER BY created_at DESC";

    const [konsultasi] = await db.query(query, params);

    res.json({
      success: true,
      data: konsultasi,
      total: konsultasi.length,
    });
  } catch (error) {
    console.error("[Konsultasi Controller] Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data konsultasi",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * GET /api/konsultasi/:id
 * Detail konsultasi
 */
export const getKonsultasiDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const [konsultasi] = await db.query("SELECT * FROM konsultasi WHERE id = ?", [id]);

    if (konsultasi.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Konsultasi tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: konsultasi[0],
    });
  } catch (error) {
    console.error("[Konsultasi Controller] Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail konsultasi",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * PUT /api/konsultasi/:id
 * Petugas merespons/update status konsultasi
 */
export const updateKonsultasi = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, respons } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status harus diisi",
      });
    }

    const [result] = await db.query(
      "UPDATE konsultasi SET status = ?, respons = ?, updated_at = NOW() WHERE id = ?",
      [status, respons || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Konsultasi tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Konsultasi berhasil diupdate",
    });
  } catch (error) {
    console.error("[Konsultasi Controller] Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengupdate konsultasi",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * DELETE /api/konsultasi/:id
 * Hapus konsultasi
 */
export const deleteKonsultasi = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM konsultasi WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Konsultasi tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Konsultasi berhasil dihapus",
    });
  } catch (error) {
    console.error("[Konsultasi Controller] Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus konsultasi",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * GET /api/konsultasi/user/:userId
 * User melihat konsultasi mereka sendiri
 */
export const getUserKonsultasi = async (req, res) => {
  try {
    const { userId } = req.params;

    const [konsultasi] = await db.query("SELECT * FROM konsultasi WHERE user_id = ? ORDER BY created_at DESC", [
      userId,
    ]);

    res.json({
      success: true,
      data: konsultasi,
      total: konsultasi.length,
    });
  } catch (error) {
    console.error("[Konsultasi Controller] Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data konsultasi user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
