import db from "../config/db.js";

/**
 * POST /api/konsumsi
 * User menambah entri konsumsi makanan/minuman
 */
export const addKonsumsi = async (req, res) => {
  try {
    const { user_id, tanggal, waktu_makan, nama_makanan, porsi, catatan } = req.body;

    if (!user_id || !tanggal || !waktu_makan || !nama_makanan) {
      return res.status(400).json({
        success: false,
        message: "user_id, tanggal, waktu_makan, dan nama_makanan wajib diisi",
      });
    }

    const validWaktu = ["pagi", "siang", "sore", "malam", "minuman"];
    if (!validWaktu.includes(waktu_makan)) {
      return res.status(400).json({
        success: false,
        message: "waktu_makan tidak valid",
      });
    }

    const [result] = await db.query(
      `INSERT INTO konsumsi_makanan (user_id, tanggal, waktu_makan, nama_makanan, porsi, catatan)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, tanggal, waktu_makan, nama_makanan, porsi || null, catatan || null]
    );

    res.status(201).json({
      success: true,
      message: "Data konsumsi berhasil disimpan",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("[Konsumsi Controller] addKonsumsi Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menyimpan data konsumsi",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * GET /api/konsumsi/user/:userId
 * User/Petugas melihat konsumsi berdasarkan user_id (dengan filter tanggal opsional)
 */
export const getKonsumsiByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { tanggal } = req.query;

    let query = `
      SELECT k.*, u.nama AS nama_user
      FROM konsumsi_makanan k
      JOIN users u ON k.user_id = u.id
      WHERE k.user_id = ?
    `;
    const params = [userId];

    if (tanggal) {
      query += " AND k.tanggal = ?";
      params.push(tanggal);
    }

    query += " ORDER BY k.tanggal DESC, FIELD(k.waktu_makan, 'pagi','siang','sore','malam','minuman'), k.id ASC";

    const [rows] = await db.query(query, params);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("[Konsumsi Controller] getKonsumsiByUser Error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data konsumsi" });
  }
};

/**
 * GET /api/konsumsi
 * Petugas melihat semua konsumsi semua user (dengan filter user_id/tanggal opsional)
 */
export const getAllKonsumsi = async (req, res) => {
  try {
    const { user_id, tanggal } = req.query;

    let query = `
      SELECT k.*, u.nama AS nama_user, u.email AS email_user
      FROM konsumsi_makanan k
      JOIN users u ON k.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (user_id) {
      query += " AND k.user_id = ?";
      params.push(user_id);
    }
    if (tanggal) {
      query += " AND k.tanggal = ?";
      params.push(tanggal);
    }

    query += " ORDER BY k.tanggal DESC, u.nama ASC, FIELD(k.waktu_makan,'pagi','siang','sore','malam','minuman'), k.id ASC";

    const [rows] = await db.query(query, params);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("[Konsumsi Controller] getAllKonsumsi Error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data konsumsi" });
  }
};

/**
 * PUT /api/konsumsi/:id
 * User mengupdate entri konsumsi miliknya
 */
export const updateKonsumsi = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, tanggal, waktu_makan, nama_makanan, porsi, catatan } = req.body;

    // Verifikasi kepemilikan – pastikan record milik user yg request
    const [rows] = await db.query("SELECT * FROM konsumsi_makanan WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    // Hanya pemilik atau ahli_gizi yang bisa edit
    const record = rows[0];
    const tokenUserId = req.user?.id;
    const tokenRole = req.user?.role;
    if (tokenRole !== "ahli_gizi" && String(record.user_id) !== String(tokenUserId)) {
      return res.status(403).json({ success: false, message: "Tidak diizinkan mengedit data ini" });
    }

    if (waktu_makan) {
      const validWaktu = ["pagi", "siang", "sore", "malam", "minuman"];
      if (!validWaktu.includes(waktu_makan)) {
        return res.status(400).json({ success: false, message: "waktu_makan tidak valid" });
      }
    }

    await db.query(
      `UPDATE konsumsi_makanan
       SET tanggal = COALESCE(?, tanggal),
           waktu_makan = COALESCE(?, waktu_makan),
           nama_makanan = COALESCE(?, nama_makanan),
           porsi = ?,
           catatan = ?
       WHERE id = ?`,
      [tanggal || null, waktu_makan || null, nama_makanan || null, porsi ?? record.porsi, catatan ?? record.catatan, id]
    );

    res.json({ success: true, message: "Data konsumsi berhasil diupdate" });
  } catch (error) {
    console.error("[Konsumsi Controller] updateKonsumsi Error:", error);
    res.status(500).json({ success: false, message: "Gagal mengupdate data konsumsi" });
  }
};

/**
 * DELETE /api/konsumsi/:id
 * User atau Petugas menghapus entri konsumsi
 */
export const deleteKonsumsi = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("SELECT * FROM konsumsi_makanan WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    const record = rows[0];
    const tokenUserId = req.user?.id;
    const tokenRole = req.user?.role;
    if (tokenRole !== "ahli_gizi" && String(record.user_id) !== String(tokenUserId)) {
      return res.status(403).json({ success: false, message: "Tidak diizinkan menghapus data ini" });
    }

    await db.query("DELETE FROM konsumsi_makanan WHERE id = ?", [id]);

    res.json({ success: true, message: "Data konsumsi berhasil dihapus" });
  } catch (error) {
    console.error("[Konsumsi Controller] deleteKonsumsi Error:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus data konsumsi" });
  }
};
