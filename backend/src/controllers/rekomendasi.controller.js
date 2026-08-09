import axios from "axios";
import db from "../config/db.js";

// Get ML Service URL from environment or use default
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5001";

// ==================== HELPER FUNCTIONS ====================

/**
 * Deteksi kategori usia (hanya dewasa)
 * @param {number} usia - Umur dalam tahun
 * @returns {string} 'dewasa'
 */
const detectAgeCategory = (usia) => {
  return 'dewasa';
};

/**
 * Hitung BMR (Basal Metabolic Rate) berdasarkan usia
 * Menggunakan Harris-Benedict untuk dewasa
 * Untuk remaja, menggunakan Harris-Benedict dengan adjustment growth allowance
 * @returns {number} BMR dalam kcal
 */
const calculateBMR = (usia, berat, tinggi, jenis_kelamin) => {
  let bmr;
  
  // Harris-Benedict Formula (berlaku untuk semua usia)
  if (jenis_kelamin === 'pria') {
    bmr = 88.362 + (13.397 * berat) + (4.799 * tinggi) - (5.677 * usia);
  } else {
    bmr = 447.593 + (9.247 * berat) + (3.098 * tinggi) - (4.33 * usia);
  }
  
  return bmr;
};

/**
 * Hitung TDEE (hanya untuk dewasa)
 * @param {number} bmr - Basal Metabolic Rate
 * @param {number} usia - Umur pengguna
 * @param {string} aktivitas - Level aktivitas (ringan, sedang, berat)
 * @returns {number} TDEE dalam kcal
 */
const calculateTDEE = (bmr, usia, aktivitas) => {
  // Activity multiplier
  let multiplier;
  switch (aktivitas) {
    case 'ringan':
      multiplier = 1.375; // Sedentary to light
      break;
    case 'sedang':
      multiplier = 1.55;  // Moderate
      break;
    case 'berat':
      multiplier = 1.725; // Very active
      break;
    default:
      multiplier = 1.55;
  }
  
  const tdee = bmr * multiplier;
  return tdee;
};

/**
 * Hitung kategori IMT (hanya untuk dewasa - Standar WHO)
 * @returns {object} {bmi, kategori, deskripsi}
 */
const calculateBMICategory = (usia, berat, tinggi, jenis_kelamin) => {
  const bmi = berat / ((tinggi / 100) ** 2);
  let kategori, deskripsi;
  
  // Standar WHO untuk dewasa
  if (bmi < 18.5) {
    kategori = 'berat badan kurang';
    deskripsi = 'BMI di bawah normal';
  } else if (bmi >= 18.5 && bmi < 25) {
    kategori = 'berat badan normal';
    deskripsi = 'BMI normal';
  } else if (bmi >= 25 && bmi < 30) {
    kategori = 'kelebihan berat badan';
    deskripsi = 'BMI di atas normal (pre-obesity)';
  } else {
    kategori = 'obesitas';
    deskripsi = 'BMI dalam kategori obesitas';
  }
  
  return {
    bmi: parseFloat(bmi.toFixed(2)),
    kategori,
    deskripsi
  };
};

/**
 * Hitung target kalori dengan adjustment untuk tujuan (dewasa)
 * @param {number} tdee - Total Daily Energy Expenditure
 * @param {string} tujuan - Tujuan gizi (seimbang, turun, naik)
 * @param {number} usia - Umur pengguna (tidak digunakan untuk adjustments)
 * @returns {number} Target calories dalam kcal
 */
const calculateTargetCalories = (tdee, tujuan, usia) => {
  let targetCalories;
  
  switch (tujuan) {
    case 'turun':
      // 15% deficit untuk menurunkan berat badan
      targetCalories = tdee * 0.85;
      break;
    case 'naik':
      // 15% surplus untuk menaikkan berat badan
      targetCalories = tdee * 1.15;
      break;
    case 'seimbang':
    default:
      targetCalories = tdee;
  }
  
  return targetCalories;
};

/**
 * Validasi input usia - mendukung remaja awal (13 tahun) hingga dewasa
 * @throws Error jika usia tidak valid
 */
const validateAge = (usia) => {
  const ageNum = parseInt(usia);
  
  if (isNaN(ageNum)) {
    throw new Error('Usia harus berupa angka');
  }
  
  if (ageNum < 13) {
    throw new Error('Sistem mendukung pengguna minimal usia 13 tahun');
  }
  
  if (ageNum > 120) {
    throw new Error('Usia tidak valid (melebihi batas wajar)');
  }
};

/**
 * Helper function untuk hitung target macronutrients berdasarkan target calories dan tujuan gizi
 * Persentase makronutrisi dinamis sesuai dengan tujuan (turun, naik, seimbang)
 * 
 * @param {number} targetCalories - Target kalori per meal
 * @param {string} tujuan - Tujuan gizi (turun/naik/seimbang)
 * @returns {object} {protein_g, lemak_g, karbohidrat_g}
 */
const calculateMacronutrients = (targetCalories, tujuan = 'seimbang') => {
  let proteinPercent, karbohidratPercent, lemakPercent;
  
  switch (tujuan) {
    case 'turun':
      // Menurunkan BB: Protein 35% (high protein), Carbs 45%, Fat 20%
      proteinPercent = 0.35;
      karbohidratPercent = 0.45;
      lemakPercent = 0.20;
      break;
      
    case 'naik':
      // Menaikkan BB: Protein 15%, Carbs 55% (high carbs untuk energi), Fat 30%
      proteinPercent = 0.15;
      karbohidratPercent = 0.55;
      lemakPercent = 0.30;
      break;
      
    case 'seimbang':
    default:
      // Seimbang: Protein 25%, Carbs 50%, Fat 25%
      proteinPercent = 0.25;
      karbohidratPercent = 0.50;
      lemakPercent = 0.25;
  }
  
  return {
    protein_g: Math.round((targetCalories * proteinPercent) / 4 * 10) / 10,        // 1g protein = 4 kal
    lemak_g: Math.round((targetCalories * lemakPercent) / 9 * 10) / 10,             // 1g fat = 9 kal
    karbohidrat_g: Math.round((targetCalories * karbohidratPercent) / 4 * 10) / 10  // 1g carbs = 4 kal
  };
};

/**
 * Get rekomendasi makanan menggunakan KNN algorithm (LEVEL 1: Weighted Distance)
 * @param {object} userProfile - User profile dengan kalori dan target calories
 * @param {number} k - Jumlah rekomendasi
 */
const getRecommendations = async (userProfile, k = 7) => {
  try {
    console.log("[Rekomendasi Controller] Requesting recommendations from ML Service");
    console.log("[Rekomendasi Controller] User Profile:", {
      target_calories: userProfile.target_calories,
      calories_per_meal: userProfile.calories_per_meal,
      tujuan: userProfile.tujuan,
    });

    // Calculate target macronutrients for per-meal calories dengan logika dinamis berdasarkan tujuan
    const caloriesPerMeal = userProfile.calories_per_meal;
    const macros = calculateMacronutrients(caloriesPerMeal, userProfile.tujuan);

    console.log("[Rekomendasi Controller] Target Nutrients for KNN (per meal) - Tujuan:", userProfile.tujuan, {
      energy: caloriesPerMeal,
      protein_g: macros.protein_g,
      fat_g: macros.lemak_g,
      carbs_g: macros.karbohidrat_g
    });

    const nutrients = [
      macros.protein_g,
      macros.lemak_g,
      macros.karbohidrat_g
    ];

    const response = await axios.post(
      `${ML_SERVICE_URL}/api/knn/recommend`,
      {
        nutrients: nutrients,
        k: k,
        distance_metric: "euclidean",
        kategori: userProfile.kategori || "all"
      },
      {
        timeout: parseInt(process.env.ML_SERVICE_TIMEOUT || "60000"),
      }
    );

    if (!response.data || !response.data.recommendations) {
      throw new Error("Invalid response format from ML Service");
    }

    console.log(
      `[Rekomendasi Controller] Got ${response.data.recommendations.length} recommendations (Mode: ${response.data.mode})`
    );
    return {
      recommendations: response.data.recommendations,
      targetNutrients: {
        calories: caloriesPerMeal,
        protein_g: macros.protein_g,
        lemak_g: macros.lemak_g,
        karbohidrat_g: macros.karbohidrat_g
      }
    };
  } catch (error) {
    console.error("[Rekomendasi Controller] Error:", error.message);
    throw new Error(
      `Gagal mendapatkan rekomendasi: ${error.message}`
    );
  }
};

/**
 * POST /api/rekomendasi
 * Mendapatkan rekomendasi makanan berdasarkan profil pengguna (dewasa)
 */
export const getRekomendasi = async (req, res) => {
  try {
    const {
      usia,
      tinggi,
      berat,
      jenis_kelamin,
      aktivitas,
      tujuan,
      kategori = "all",
      jumlah = 7,
    } = req.body;

    // Validasi input
    if (
      !usia ||
      !tinggi ||
      !berat ||
      !jenis_kelamin ||
      !aktivitas ||
      !tujuan
    ) {
      return res.status(400).json({
        success: false,
        message: "Semua field harus diisi",
      });
    }

    // Validasi usia
    try {
      validateAge(usia);
    } catch (ageError) {
      return res.status(400).json({
        success: false,
        message: ageError.message,
      });
    }

    // Deteksi kategori usia
    const ageCategory = detectAgeCategory(parseInt(usia));

    // Hitung BMR menggunakan formula yang sama untuk semua (Harris-Benedict)
    const bmr = calculateBMR(parseInt(usia), parseFloat(berat), parseFloat(tinggi), jenis_kelamin);

    // Hitung TDEE dengan adjustment untuk remaja
    const tdee = calculateTDEE(bmr, parseInt(usia), aktivitas);

    // Hitung target kalori dengan adjustment berdasarkan tujuan
    const targetCalories = calculateTargetCalories(tdee, tujuan, parseInt(usia));

    // Hitung BMI dan kategorinya
    const bmiData = calculateBMICategory(parseInt(usia), parseFloat(berat), parseFloat(tinggi), jenis_kelamin);

    // Hitung kalori per makan (dibagi 4: breakfast, lunch, dinner, snack)
    const mealsPerDay = 4;
    const targetCaloriesPerMeal = Math.round(targetCalories / mealsPerDay);

    // Buat user profile untuk KNN
    const userProfile = {
      usia: parseInt(usia),
      age_category: ageCategory,
      bmi: bmiData.bmi,
      bmi_category: bmiData.kategori,
      bmi_description: bmiData.deskripsi,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      target_calories: Math.round(targetCalories),
      calories_per_meal: targetCaloriesPerMeal,
      meals_per_day: mealsPerDay,
      jenis_kelamin,
      aktivitas,
      tujuan,
      kategori,
    };

    // Dapatkan rekomendasi dari ML Service
    const rekomendasiResult = await getRecommendations(userProfile, jumlah);
    const recommendations = rekomendasiResult.recommendations;
    const targetNutrients = rekomendasiResult.targetNutrients;

    // Filter berdasarkan kategori sudah di-handle oleh ML Service
    const filteredRecommendations = recommendations;

    // Response note
    const responseNote = 'Rekomendasi untuk dewasa (LEVEL 1: Weighted KNN Distance)';

    res.json({
      success: true,
      count: filteredRecommendations.length,
      note: responseNote,
      userProfile,
      targetNutrients,
      recommendations: filteredRecommendations,
    });
  } catch (error) {
    console.error("[Rekomendasi Controller] Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Gagal mendapatkan rekomendasi",
      error: error.message,
    });
  }
};

/**
 * GET /api/rekomendasi/kalori-kebutuhan
 * Hitung kebutuhan kalori harian (dewasa)
 */
export const getKaloriKebutuhan = async (req, res) => {
  try {
    const { usia, tinggi, berat, jenis_kelamin, aktivitas, tujuan } = req.query;

    // Validasi input
    if (
      !usia ||
      !tinggi ||
      !berat ||
      !jenis_kelamin ||
      !aktivitas ||
      !tujuan
    ) {
      return res.status(400).json({
        success: false,
        message: "Semua parameter harus diisi",
      });
    }

    // Validasi usia
    try {
      validateAge(usia);
    } catch (ageError) {
      return res.status(400).json({
        success: false,
        message: ageError.message,
      });
    }

    const usiaNum = parseInt(usia);
    const tinggiNum = parseFloat(tinggi);
    const beratNum = parseFloat(berat);
    const ageCategory = detectAgeCategory(usiaNum);

    // Hitung BMI dan kategorinya
    const bmiData = calculateBMICategory(usiaNum, beratNum, tinggiNum, jenis_kelamin);

    // Hitung BMR
    const bmr = calculateBMR(usiaNum, beratNum, tinggiNum, jenis_kelamin);

    // Hitung TDEE dengan adjustment untuk remaja
    const tdee = calculateTDEE(bmr, usiaNum, aktivitas);

    // Hitung target kalori dengan adjustment berdasarkan tujuan
    const targetCalories = calculateTargetCalories(tdee, tujuan, usiaNum);

    res.json({
      success: true,
      age_category: ageCategory,
      bmi: bmiData.bmi,
      bmi_category: bmiData.kategori,
      bmi_description: bmiData.deskripsi,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      target_calories: Math.round(targetCalories),
      note: 'Perhitungan untuk dewasa',
    });
  } catch (error) {
    console.error("[Rekomendasi Controller] Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghitung kebutuhan kalori",
      error: error.message,
    });
  }
};

/**
 * POST /api/rekomendasi/save-report
 * Menyimpan rekomendasi ke database (untuk laporan)
 */
export const saveRekomendasiReport = async (req, res) => {
  let connection = null;
  try {
    
    const {
      user_profile,
      target_nutrients,
      recommendations,
      keterangan,
      konsultasi_id,
      user_id,
    } = req.body;

    // Validasi
    if (!user_profile || !recommendations) {
      return res.status(400).json({
        success: false,
        message: "user_profile dan recommendations harus ada",
      });
    }

    console.log("[Save Report] Received data:", {
      user_profile: Object.keys(user_profile),
      recommendations_count: recommendations.length,
      petugas_id: req.user?.id,
      konsultasi_id,
      user_id,
    });

    const petugasId = req.user?.id || 1; // Dari JWT token atau default

    // Validasi bahwa semua field user_profile ada
    if (!user_profile.usia || user_profile.usia === undefined) {
      throw new Error("user_profile.usia tidak boleh kosong");
    }
    if (!user_profile.berat_badan || user_profile.berat_badan === undefined) {
      throw new Error("user_profile.berat_badan tidak boleh kosong");
    }
    if (!user_profile.tinggi_badan || user_profile.tinggi_badan === undefined) {
      throw new Error("user_profile.tinggi_badan tidak boleh kosong");
    }
    if (!user_profile.bmi || user_profile.bmi === undefined) {
      throw new Error("user_profile.bmi tidak boleh kosong");
    }

    // Insert ke tabel rekomendasi dengan konsultasi_id dan user_id
    const rekomendasiQuery = `
      INSERT INTO rekomendasi (
        petugas_id, konsultasi_id, user_id, nama_user, email_user, usia, berat_badan, 
        tinggi_badan, bmi, jenis_kelamin, aktivitas, tujuan, 
        kategori, bmr, tdee, target_calories, target_protein_g, 
        target_lemak_g, target_karbohidrat_g, jumlah_rekomendasi, 
        keterangan, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      petugasId,
      konsultasi_id || null,
      user_id || null,
      user_profile.nama_user || "User",
      user_profile.email_user || null,
      user_profile.usia,
      user_profile.berat_badan,
      user_profile.tinggi_badan,
      user_profile.bmi,
      user_profile.jenis_kelamin,
      user_profile.aktivitas,
      user_profile.tujuan,
      user_profile.kategori || "all",
      user_profile.bmr,
      user_profile.tdee,
      user_profile.target_calories,
      target_nutrients?.protein_g || 0,
      target_nutrients?.lemak_g || 0,
      target_nutrients?.karbohidrat_g || 0,
      recommendations.length,
      keterangan || "",
      "aktif",
    ];

    console.log("[Save Report] Insert values:", values);

    connection = await db.getConnection();
    console.log("[Save Report] Connection acquired");
    
    const [result] = await connection.execute(rekomendasiQuery, values);
    const rekomendasiId = result.insertId;
    console.log("[Save Report] Rekomendasi saved with ID:", rekomendasiId);

    // Insert detail rekomendasi
    const detailQuery =
      "INSERT INTO rekomendasi_detail (rekomendasi_id, nama_makanan, kode_makanan, energi_kal, protein_g, lemak_g, karbohidrat_g, `rank`, distance, similarity_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    for (const [index, rec] of recommendations.entries()) {
      const detailValues = [
        rekomendasiId,
        rec.name || rec.nama_makanan || rec.nama_bahan || "Unknown",
        rec.kode || "N/A",
        rec.energi_kal || rec.nutrients?.energi_kal || rec.energi || 0,
        rec.protein_g || rec.nutrients?.protein_g || rec.protein || 0,
        rec.lemak_g || rec.nutrients?.lemak_g || rec.lemak || 0,
        rec.karbohidrat_g || rec.nutrients?.karbohidrat_g || rec.karbohidrat || 0,
        index + 1,
        rec.distance || 0,
        rec.similarity || rec.similarity_score || 0,
      ];
      await connection.execute(detailQuery, detailValues);
    }

    console.log("[Save Report] All details inserted");

    res.json({
      success: true,
      message: "Rekomendasi berhasil disimpan",
      rekomendasi_id: rekomendasiId,
    });
  } catch (error) {
    console.error("[Save Report] Error:", error.message);
    console.error("[Save Report] Full Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Gagal menyimpan rekomendasi",
      error: error.message,
    });
  } finally {
    if (connection) {
      console.log("[Save Report] Releasing connection");
      connection.release();
    }
  }
};

/**
 * GET /api/rekomendasi/laporan
 * Mengambil daftar laporan rekomendasi
 */
export const getLaporanList = async (req, res) => {
  try {
    const petugasId = req.user?.id || 1;

    console.log("[getLaporanList] Fetching for petugas_id:", petugasId);

    const query = `
      SELECT 
        r.id,
        r.user_id,
        r.nama_user,
        COALESCE(r.email_user, u.email) as email_user,
        r.usia,
        r.berat_badan,
        r.tinggi_badan,
        r.bmi,
        r.jenis_kelamin,
        r.tujuan,
        r.target_calories,
        r.jumlah_rekomendasi,
        r.status,
        r.created_at,
        COUNT(rd.id) as total_makanan
      FROM rekomendasi r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN rekomendasi_detail rd ON r.id = rd.rekomendasi_id
      WHERE r.petugas_id = ?
      GROUP BY r.id, r.user_id, r.nama_user, r.email_user, u.email, r.usia, r.berat_badan, r.tinggi_badan, r.bmi, r.jenis_kelamin, r.tujuan, r.target_calories, r.jumlah_rekomendasi, r.status, r.created_at
      ORDER BY r.created_at DESC
      LIMIT 100
    `;

    try {
      const connection = await db.getConnection();
      const [rows] = await connection.execute(query, [petugasId]);
      connection.release();

      console.log("[getLaporanList] Found rows:", rows?.length || 0);

      res.json({
        success: true,
        data: rows || [],
        count: rows?.length || 0,
      });
    } catch (dbError) {
      console.error("[DB Error] SQL Query failed:", dbError.message);
      console.error("[DB Error] Error code:", dbError.code);
      console.error("[DB Error] Full error:", dbError);
      
      // Jika tabel belum ada, return empty array instead of error
      if (dbError.code === "ER_NO_SUCH_TABLE" || dbError.code === "ER_BAD_FIELD_ERROR") {
        console.log("[getLaporanList] Table not found, returning empty array");
        return res.json({
          success: true,
          data: [],
          count: 0,
          message: "Belum ada laporan",
        });
      }
      throw dbError;
    }
  } catch (error) {
    console.error("[Get Laporan List] Error:", error.message);
    console.error("[Get Laporan List] Stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil laporan",
      error: error.message,
    });
  }
};

/**
 * GET /api/rekomendasi/laporan/:id
 * Mengambil detail laporan rekomendasi beserta makanannya
 */
export const getLaporanDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const petugasId = req.user?.id;

    // Get rekomendasi header
    const headerQuery = `
      SELECT * FROM rekomendasi WHERE id = ? AND petugas_id = ?
    `;

    // Get detail makanan
    const detailQuery = "SELECT * FROM rekomendasi_detail WHERE rekomendasi_id = ? ORDER BY `rank` ASC";

    const connection = await db.getConnection();
    const [headerRows] = await connection.execute(headerQuery, [id, petugasId]);
    
    if (!headerRows.length) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: "Laporan tidak ditemukan atau Anda tidak memiliki akses",
      });
    }

    const [detailRows] = await connection.execute(detailQuery, [id]);
    connection.release();

    res.json({
      success: true,
      rekomendasi: headerRows[0],
      detail_makanan: detailRows,
    });
  } catch (error) {
    console.error("[Get Laporan Detail] Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail laporan",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/rekomendasi/laporan/:id
 * Menghapus laporan rekomendasi dan detail makanannya
 */
export const deleteLaporanDetail = async (req, res) => {
  let connection = null;
  try {
    const { id } = req.params;
    const petugasId = req.user?.id;

    // Verify that the laporan belongs to the current petugas
    connection = await db.getConnection();
    
    const [checkRows] = await connection.execute(
      "SELECT petugas_id FROM rekomendasi WHERE id = ?",
      [id]
    );

    if (checkRows.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: "Laporan tidak ditemukan",
      });
    }

    // Check authorization
    if (checkRows[0].petugas_id !== petugasId) {
      connection.release();
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk menghapus laporan ini",
      });
    }

    // Delete detail makanan first (foreign key constraint)
    await connection.execute(
      "DELETE FROM rekomendasi_detail WHERE rekomendasi_id = ?",
      [id]
    );

    // Delete rekomendasi
    await connection.execute(
      "DELETE FROM rekomendasi WHERE id = ?",
      [id]
    );

    connection.release();

    res.json({
      success: true,
      message: "Laporan berhasil dihapus",
    });
  } catch (error) {
    if (connection) {
      connection.release();
    }
    console.error("[Delete Laporan] Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus laporan",
      error: error.message,
    });
  }
};

/**
 * GET /api/rekomendasi/user/latest
 * Mengambil rekomendasi terbaru untuk user yang login
 */
export const getUserLatestRekomendasi = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User tidak terautentikasi",
      });
    }

    // Get latest rekomendasi for this user, including petugas respons from konsultasi
    const headerQuery = `
      SELECT r.*, k.respons AS catatan_petugas
      FROM rekomendasi r
      LEFT JOIN konsultasi k ON r.konsultasi_id = k.id
      WHERE r.user_id = ? 
      ORDER BY r.created_at DESC 
      LIMIT 1
    `;

    // Get detail makanan for the latest rekomendasi
    const connection = await db.getConnection();
    const [headerRows] = await connection.execute(headerQuery, [userId]);

    if (!headerRows.length) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: "Tidak ada rekomendasi yang ditemukan",
      });
    }

    const rekomendasi = headerRows[0];
    const detailQuery = "SELECT * FROM rekomendasi_detail WHERE rekomendasi_id = ? ORDER BY `rank` ASC";

    const [detailRows] = await connection.execute(detailQuery, [rekomendasi.id]);
    connection.release();

    res.json({
      success: true,
      rekomendasi,
      detail_makanan: detailRows,
    });
  } catch (error) {
    console.error("[Get User Latest Rekomendasi] Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil rekomendasi",
      error: error.message,
    });
  }
};

/**
 * GET /api/rekomendasi/user/list
 * Get list rekomendasi untuk user
 */
export const getUserRekomendasiList = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User tidak terautentikasi",
      });
    }

    const query = `
      SELECT 
        r.id,
        r.nama_user,
        r.usia,
        r.berat_badan,
        r.tinggi_badan,
        r.bmi,
        r.jenis_kelamin,
        r.tujuan,
        r.target_calories,
        r.jumlah_rekomendasi,
        r.status,
        r.created_at,
        COUNT(rd.id) as total_makanan
      FROM rekomendasi r
      LEFT JOIN rekomendasi_detail rd ON r.id = rd.rekomendasi_id
      WHERE r.user_id = ?
      GROUP BY r.id, r.nama_user, r.usia, r.berat_badan, r.tinggi_badan, r.bmi, r.jenis_kelamin, r.tujuan, r.target_calories, r.jumlah_rekomendasi, r.status, r.created_at
      ORDER BY r.created_at DESC
      LIMIT 100
    `;

    const connection = await db.getConnection();
    const [rows] = await connection.execute(query, [userId]);
    connection.release();

    res.json({
      success: true,
      data: rows || [],
      count: rows?.length || 0,
    });
  } catch (error) {
    console.error("[Get User Rekomendasi List] Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil daftar rekomendasi",
      error: error.message,
    });
  }
};

/**
 * GET /api/rekomendasi/user/:id
 * Get detail rekomendasi untuk user
 */
export const getUserRekomendasiDetail = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User tidak terautentikasi",
      });
    }

    // Get rekomendasi header
    const headerQuery = `
      SELECT r.*, k.respons AS catatan_petugas
      FROM rekomendasi r
      LEFT JOIN konsultasi k ON r.konsultasi_id = k.id
      WHERE r.id = ? AND r.user_id = ?
    `;

    const connection = await db.getConnection();
    const [headerRows] = await connection.execute(headerQuery, [id, userId]);

    if (!headerRows.length) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: "Rekomendasi tidak ditemukan atau Anda tidak memiliki akses",
      });
    }

    // Get detail makanan
    const detailQuery = "SELECT * FROM rekomendasi_detail WHERE rekomendasi_id = ? ORDER BY `rank` ASC";
    const [detailRows] = await connection.execute(detailQuery, [id]);
    connection.release();

    res.json({
      success: true,
      rekomendasi: headerRows[0],
      detail_makanan: detailRows,
    });
  } catch (error) {
    console.error("[Get User Rekomendasi Detail] Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail rekomendasi",
      error: error.message,
    });
  }
};

export const getNutritionRecommendations = async (req, res) => {
  try {
    const { nutrients, k = 5, distance_metric = 'euclidean' } = req.body;

    // Validasi input
    if (!nutrients || !Array.isArray(nutrients)) {
      return res.status(400).json({
        success: false,
        message: "nutrients harus berupa array [protein, carbohydrate, fat, fiber]",
      });
    }

    console.log("[KNN Recommend] Forwarding request to ML Service");
    console.log("[KNN Recommend] Nutrients:", nutrients);

    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/api/knn/recommend`,
        {
          nutrients: nutrients,
          k: k,
          distance_metric: distance_metric,
        },
        {
          timeout: parseInt(process.env.ML_SERVICE_TIMEOUT || "60000"),
        }
      );

      console.log("[KNN Recommend] Got response from ML Service");
      return res.json({
        success: true,
        recommendations: response.data.recommendations || response.data,
      });
    } catch (mlError) {
      console.error("[KNN Recommend] ML Service Error:", mlError.message);
      throw new Error(`ML Service error: ${mlError.message}`);
    }
  } catch (error) {
    console.error("[KNN Recommend] Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Gagal mendapatkan rekomendasi nutrisi",
      error: error.message,
    });
  }
};

/**
 * POST /api/rekomendasi/knn/profile
 * Proxy endpoint untuk nutritional profile analysis dari ML Service
 */
export const getNutritionProfile = async (req, res) => {
  try {
    const { nutrients } = req.body;

    // Validasi input
    if (!nutrients || !Array.isArray(nutrients)) {
      return res.status(400).json({
        success: false,
        message: "nutrients harus berupa array [protein, carbohydrate, fat, fiber]",
      });
    }

    console.log("[KNN Profile] Forwarding request to ML Service");
    console.log("[KNN Profile] Nutrients:", nutrients);

    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/api/knn/profile`,
        {
          nutrients: nutrients,
        },
        {
          timeout: parseInt(process.env.ML_SERVICE_TIMEOUT || "60000"),
        }
      );

      console.log("[KNN Profile] Got response from ML Service");
      return res.json({
        success: true,
        profile: response.data.profile || response.data,
      });
    } catch (mlError) {
      console.error("[KNN Profile] ML Service Error:", mlError.message);
      throw new Error(`ML Service error: ${mlError.message}`);
    }
  } catch (error) {
    console.error("[KNN Profile] Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Gagal mendapatkan profil nutrisi",
      error: error.message,
    });
  }
};

/**
 * POST /api/rekomendasi/knn/predict
 * Proxy endpoint untuk food prediction dari ML Service
 */
export const predictFood = async (req, res) => {
  try {
    const { features, distance_metric = 'euclidean' } = req.body;

    // Validasi input
    if (!features || !Array.isArray(features)) {
      return res.status(400).json({
        success: false,
        message: "features harus berupa array [protein, carbs, fat, fiber]",
      });
    }

    console.log("[KNN Predict] Forwarding request to ML Service");
    console.log("[KNN Predict] Features:", features);

    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/api/knn/predict`,
        {
          features: features,
          distance_metric: distance_metric,
        },
        {
          timeout: parseInt(process.env.ML_SERVICE_TIMEOUT || "60000"),
        }
      );

      console.log("[KNN Predict] Got response from ML Service");
      return res.json({
        success: true,
        predictions: response.data.predictions || response.data,
      });
    } catch (mlError) {
      console.error("[KNN Predict] ML Service Error:", mlError.message);
      throw new Error(`ML Service error: ${mlError.message}`);
    }
  } catch (error) {
    console.error("[KNN Predict] Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Gagal memprediksi makanan",
      error: error.message,
    });
  }
};

/**
 * GET /api/rekomendasi/available/:userId
 * Mengambil daftar laporan yang tersedia untuk diberikan kepada user tertentu
 */
export const getAvailableLaporanForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const petugasId = req.user?.id;

    console.log("[getAvailableLaporanForUser] Fetching available laporan for user:", userId, "petugas:", petugasId);

    const query = `
      SELECT 
        r.id,
        r.user_id,
        r.nama_user,
        COALESCE(r.email_user, u.email) as email_user,
        r.usia,
        r.berat_badan,
        r.tinggi_badan,
        r.bmi,
        r.tujuan,
        r.target_calories,
        r.jumlah_rekomendasi,
        r.keterangan,
        r.created_at,
        COUNT(rd.id) as total_makanan
      FROM rekomendasi r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN rekomendasi_detail rd ON r.id = rd.rekomendasi_id
      WHERE r.petugas_id = ? AND r.status = 'aktif'
      GROUP BY r.id, r.user_id, r.nama_user, r.email_user, u.email, r.usia, r.berat_badan, r.tinggi_badan, r.bmi, r.tujuan, r.target_calories, r.jumlah_rekomendasi, r.keterangan, r.created_at
      ORDER BY r.created_at DESC
      LIMIT 50
    `;

    const connection = await db.getConnection();
    const [rows] = await connection.execute(query, [petugasId]);
    connection.release();

    console.log("[getAvailableLaporanForUser] Found:", rows?.length || 0, "laporan");

    res.json({
      success: true,
      data: rows || [],
      count: rows?.length || 0,
    });
  } catch (error) {
    console.error("[getAvailableLaporanForUser] Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Gagal mengambil daftar laporan",
    });
  }
};

/**
 * POST /api/rekomendasi/:rekoId/give-to-user/:userId
 * Memberikan laporan rekomendasi kepada user
 */
export const giveRekomendasiToUser = async (req, res) => {
  let connection = null;
  try {
    const { rekoId, userId } = req.params;
    const { konsultasi_id } = req.body;
    const petugasId = req.user?.id;

    console.log("[giveRekomendasiToUser] Assigning laporan", rekoId, "to user", userId, "from petugas", petugasId);

    connection = await db.getConnection();

    // Validasi 1: Pastikan laporan milik petugas yang login
    const validateQuery = `SELECT id, petugas_id FROM rekomendasi WHERE id = ? AND petugas_id = ?`;
    const [validRows] = await connection.execute(validateQuery, [rekoId, petugasId]);

    if (!validRows || validRows.length === 0) {
      connection.release();
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke laporan ini",
      });
    }

    // Validasi 2: Pastikan userId valid (user ada di database)
    const userCheckQuery = `SELECT id FROM users WHERE id = ?`;
    const [userRows] = await connection.execute(userCheckQuery, [userId]);

    if (!userRows || userRows.length === 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: "User dengan ID yang diberikan tidak ditemukan",
      });
    }

    // Update user_id dan konsultasi_id pada rekomendasi
    const updateQuery = konsultasi_id
      ? `UPDATE rekomendasi SET user_id = ?, konsultasi_id = ? WHERE id = ?`
      : `UPDATE rekomendasi SET user_id = ? WHERE id = ?`;
    const updateParams = konsultasi_id
      ? [userId, konsultasi_id, rekoId]
      : [userId, rekoId];
    const [updateResult] = await connection.execute(updateQuery, updateParams);
    connection.release();

    console.log("[giveRekomendasiToUser] Updated rows:", updateResult?.affectedRows);

    if (updateResult?.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Laporan tidak ditemukan atau sudah diperbarui",
      });
    }

    res.json({
      success: true,
      message: "Rekomendasi berhasil diberikan kepada user",
      rekomendasi_id: rekoId,
    });
  } catch (error) {
    if (connection) {
      connection.release();
    }
    console.error("[giveRekomendasiToUser] Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Gagal memberikan rekomendasi",
    });
  }
};
