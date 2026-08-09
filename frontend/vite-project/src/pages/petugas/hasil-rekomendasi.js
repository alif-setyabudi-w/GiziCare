import "../../styles/petugas-css/hasil-rekomendasi.css";
import Swal from "sweetalert2";
import { getUserData, getRekomendasi, saveRekomendasiReport } from "../../api/backend.js";
import {
  renderPetugasSidebar,
  setupPetugasSidebarLogout,
} from "../../components/sidebar-petugas.js";

export function renderPetugasHasilRekomendasi(root) {
  const user = getUserData();

  // Cek Role: Harus 'ahli_gizi'
  if (!user || user.role !== "ahli_gizi") {
    window.location.href = "/login";
    return;
  }

  // Ambil data dari sessionStorage
  const resultsData = sessionStorage.getItem("rekomendasiResults");
  if (!resultsData) {
    root.innerHTML = `
      <div class="hasil-rekomendasi-wrapper">
        <div class="hasil-rekomendasi-container">
          ${renderPetugasSidebar("rekomendasi")}
          <main class="hasil-rekomendasi-empty">
            <div class="empty-state">
              <div class="empty-icon">📄</div>
              <h2>Tidak Ada Data</h2>
              <p>Silakan buat rekomendasi terlebih dahulu</p>
              <a href="/petugas/rekomendasi" class="btn-back">Kembali ke Form</a>
            </div>
          </main>
        </div>
      </div>
    `;
    setupPetugasSidebarLogout();
    return;
  }

  const results = JSON.parse(resultsData);
  const { profileData, recommendations } = results;

  root.innerHTML = `
    <div class="hasil-rekomendasi-wrapper">
        ${renderPetugasSidebar("rekomendasi")}

        <main class="hasil-rekomendasi-main-content">
          <div class="hasil-rekomendasi-topbar">
            <div class="hasil-rekomendasi-topbar-left">
              <div class="hasil-rekomendasi-topbar-title">
                <h1>Hasil Rekomendasi Gizi</h1>
                <p>Detail rekomendasi makanan untuk klien</p>
              </div>
            </div>
            <div class="hasil-rekomendasi-topbar-user">
              <div class="hasil-rekomendasi-user-avatar">
                ${user.nama?.charAt(0).toUpperCase()}
              </div>
              <div class="hasil-rekomendasi-user-info">
                <p class="hasil-rekomendasi-user-name">${user.nama}</p>
                <p class="hasil-rekomendasi-user-role">Petugas Gizi</p>
              </div>
            </div>
          </div>

          <div class="hasil-rekomendasi-content">
            <!-- Profil Klien -->
            <div class="hasil-rekomendasi-profile-section">
              <h2>📋 Profil Klien</h2>
              <div id="profileCard" class="hasil-rekomendasi-profile-card"></div>
            </div>

            <!-- Analisis Kesehatan -->
            <div class="hasil-rekomendasi-analysis-section">
              <h2>📊 Analisis Kesehatan</h2>
              <div id="analysisCard" class="hasil-rekomendasi-analysis-card"></div>
            </div>

            <!-- Rekomendasi Makanan -->
            <div class="hasil-rekomendasi-foods-section">
              <h2>🍎 Rekomendasi Makanan</h2>
              <div id="foodsList" class="hasil-rekomendasi-foods-grid"></div>
            </div>

            <!-- Action Buttons -->
            <div class="hasil-rekomendasi-actions">
              <button id="saveBtn" class="btn-save">💾 Simpan Laporan</button>
              <button id="backBtn" class="btn-back">⬅️ Kembali ke Form</button>
            </div>
          </div>
        </main>
    </div>
  `;

  setupPetugasSidebarLogout();
  
  // Load data rekomendasi dari Backend (ML Service)
  loadAndPopulateResults(profileData, root);
}

async function loadAndPopulateResults(profileData, root) {
  try {
    console.log("📥 Mengambil rekomendasi dari ML Service via Backend...");
    
    // Tampilkan loading karena ML request bisa memakan waktu sedikit
    Swal.fire({
      title: 'Memproses...',
      text: 'Menganalisis profil gizi Anda dengan sistem cerdas',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Panggil API Backend (yang secara otomatis memanggil ML Service)
    const backendRecommendations = await getRekomendasi(profileData);
    
    Swal.close();
    
    console.log("📊 Data rekomendasi ML Service berhasil diterima:", backendRecommendations.length, "items");
    
    if (backendRecommendations && backendRecommendations.length > 0) {
      // Perbarui rekomendasi di Session Storage dengan data baru dari ML Service
      const resultsData = JSON.parse(sessionStorage.getItem("rekomendasiResults")) || {};
      resultsData.recommendations = backendRecommendations;
      sessionStorage.setItem("rekomendasiResults", JSON.stringify(resultsData));

      populateResults(profileData, backendRecommendations);
      setupHasilRekomendasiHandlers(profileData, backendRecommendations);
    } else {
      console.warn("⚠️ Data rekomendasi dari backend kosong.");
      Swal.fire('Informasi', 'Tidak menemukan rekomendasi yang cocok di database.', 'info');
      populateResults(profileData, []);
      setupHasilRekomendasiHandlers(profileData, []);
    }
  } catch (error) {
    Swal.close();
    console.error("✗ Error in loadAndPopulateResults:", error.message);
    Swal.fire({
      title: 'Terjadi Kesalahan',
      text: 'Gagal menghubungi server rekomendasi. Pastikan ML Service berjalan di production.',
      icon: 'error'
    });
    
    // Fallback error state
    populateResults(profileData, []);
    setupHasilRekomendasiHandlers(profileData, []);
  }
}

// Menghapus blok fungsi generateKNNRecommendations berbasis JS karena sudah diganti ML Service Python

function setupHasilRekomendasiHandlers(profileData, recommendations) {
  const saveBtn = document.getElementById("saveBtn");
  const backBtn = document.getElementById("backBtn");

  saveBtn.addEventListener("click", async () => {
    await handleSaveLaporan(profileData, recommendations);
  });

  backBtn.addEventListener("click", () => {
    sessionStorage.removeItem("rekomendasiResults");
    window.location.href = "/petugas/rekomendasi";
  });
}

function populateResults(profileData, recommendations) {
  // Hitung BMI
  const bmi = profileData.berat / ((profileData.tinggi / 100) ** 2);
  const bmiStatus = getBMIStatus(bmi);
  const bmiColor = getBMIColor(bmi);
  const bmr = calculateBMR(profileData);
  const tdee = calculateTDEE(profileData);
  const targetCalories = calculateTargetCalories(profileData);

  // Profile Card
  const profileCard = document.getElementById("profileCard");
  profileCard.innerHTML = `
    <div class="profile-grid">
      <div class="profile-item">
        <span class="item-label">Nama Klien</span>
        <span class="item-value">${profileData.nama || "-"}</span>
      </div>
      <div class="profile-item">
        <span class="item-label">Email Klien</span>
        <span class="item-value">${profileData.email || "-"}</span>
      </div>
      <div class="profile-item">
        <span class="item-label">Usia</span>
        <span class="item-value">${profileData.usia || "-"} tahun</span>
      </div>
      <div class="profile-item">
        <span class="item-label">Jenis Kelamin</span>
        <span class="item-value">${profileData.jenis_kelamin === "pria" ? "Pria" : (profileData.jenis_kelamin === "wanita" ? "Wanita" : "-")}</span>
      </div>
      <div class="profile-item">
        <span class="item-label">Berat Badan</span>
        <span class="item-value">${profileData.berat || "-"} kg</span>
      </div>
      <div class="profile-item">
        <span class="item-label">Tinggi Badan</span>
        <span class="item-value">${profileData.tinggi || "-"} cm</span>
      </div>
      <div class="profile-item">
        <span class="item-label">Tingkat Aktivitas</span>
        <span class="item-value">${getActivityLabel(profileData.aktivitas)}</span>
      </div>
      <div class="profile-item">
        <span class="item-label">Tujuan</span>
        <span class="item-value">${getGoalLabel(profileData.tujuan)}</span>
      </div>
      <div class="profile-item">
        <span class="item-label">Kategori</span>
        <span class="item-value">${profileData.kategori === "all" ? "Semua Kategori" : (profileData.kategori || "-")}</span>
      </div>
    </div>
  `;

  // Analysis Card
  const analysisCard = document.getElementById("analysisCard");
  
  // Hitung kalori per makan (total kalori dibagi 4 makan dalam sehari)
  const caloriesPerMeal = Math.round(targetCalories / 4);
  
  analysisCard.innerHTML = `
    <div class="analysis-grid">
      <div class="analysis-item">
        <div class="analysis-label">BMI</div>
        <div class="analysis-value" style="color: ${bmiColor}; font-size: 1.75rem; font-weight: 700;">
          ${bmi.toFixed(1)}
        </div>
        <div class="analysis-status" style="color: ${bmiColor};">${bmiStatus}</div>
      </div>
      <div class="analysis-item">
        <div class="analysis-label">BMR (Basal Metabolic Rate)</div>
        <div class="analysis-value">${Math.round(bmr).toLocaleString('id-ID')} kal</div>
        <div class="analysis-status">Kalori minimum harian</div>
      </div>
      <div class="analysis-item">
        <div class="analysis-label">TDEE (Total Daily Energy Expenditure)</div>
        <div class="analysis-value">${Math.round(tdee).toLocaleString('id-ID')} kal</div>
        <div class="analysis-status">Kalori harian normal</div>
      </div>
      <div class="analysis-item">
        <div class="analysis-label">Target Kalori Harian</div>
        <div class="analysis-value">${Math.round(targetCalories).toLocaleString('id-ID')} kal</div>
        <div class="analysis-status">${getGoalLabel(profileData.tujuan)}</div>
      </div>
      <div class="analysis-item">
        <div class="analysis-label">🔥 Kalori Per Makan</div>
        <div class="analysis-value" style="color: #ff6b6b; font-size: 1.75rem; font-weight: 700;">
          ${caloriesPerMeal.toLocaleString('id-ID')} kal
        </div>
        <div class="analysis-status">Sarapan Per-harinya</div>
      </div>
    </div>
  `;

  // Foods List - Handle both nama and nama_bahan fields
  const foodsList = document.getElementById("foodsList");
  
  if (recommendations && recommendations.length > 0) {
    // Ensure recommendations are sorted by similarity (highest first)
    const sortedRecs = [...recommendations].sort((a, b) => {
      const simA = a.similarity || 0;
      const simB = b.similarity || 0;
      return simB - simA;
    });
    
    let html = "";
    sortedRecs.forEach((item, index) => {
      const foodName = item.nama_bahan || item.nama || item.kode || "Makanan";
      const energi = item.energi_kal || item.energi || 0;
      const protein = item.protein_g || item.protein || 0;
      const lemak = item.lemak_g || item.lemak || 0;
      const karbohidrat = item.karbohidrat_g || item.karbohidrat || 0;
      
      // Calculate similarity percentage
      const similarityValue = item.similarity || 0;
      const similarityPercent = (similarityValue * 100).toFixed(1);
      
      // Determine similarity badge color based on score
      let badgeColor = "#dc2626"; // red for low
      let badgeBg = "#fee2e2";
      let badgeText = "#7f1d1d";
      
      if (similarityPercent >= 70) {
        badgeColor = "#16a34a"; // green for high
        badgeBg = "#dcfce7";
        badgeText = "#15803d";
      } else if (similarityPercent >= 50) {
        badgeColor = "#ea580c"; // orange for medium
        badgeBg = "#fed7aa";
        badgeText = "#92400e";
      }
      
      html += `
        <div class="food-card">
          <div class="food-header">
            <span class="food-number">#${index + 1}</span>
            <h3 style="color:#ffff;" class="food-name">${foodName}</h3>
            <span class="food-similarity" style="background-color: ${badgeBg}; color: ${badgeText}; border-left: 3px solid ${badgeColor};">${similarityPercent}%</span>
          </div>
          <div class="food-details">
            <div class="detail-item">
              <span class="detail-label">Energi</span>
              <span class="detail-value">${energi} kal</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Protein</span>
              <span class="detail-value">${protein} g</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Lemak</span>
              <span class="detail-value">${lemak} g</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Karbohidrat</span>
              <span class="detail-value">${karbohidrat} g</span>
            </div>
          </div>
        </div>
      `;
      
      // Debug log
      console.log(`Food #${index + 1}: ${foodName} - Similarity: ${similarityPercent}%`);
    });
    
    // Set foods list
    foodsList.innerHTML = html;
  } else {
    foodsList.innerHTML = `
      <div class="no-recommendations">
        <p>❌ Tidak ada rekomendasi yang ditemukan</p>
      </div>
    `;
  }
}

function calculateBMR(profileData) {
  if (profileData.jenis_kelamin === "pria") {
    return 88.362 + 13.397 * profileData.berat + 4.799 * profileData.tinggi - 5.677 * profileData.usia;
  } else {
    return 447.593 + 9.247 * profileData.berat + 3.098 * profileData.tinggi - 4.33 * profileData.usia;
  }
}

function calculateTDEE(profileData) {
  const bmr = calculateBMR(profileData);
  let multiplier;
  switch (profileData.aktivitas) {
    case "ringan":
      multiplier = 1.375;
      break;
    case "sedang":
      multiplier = 1.55;
      break;
    case "berat":
      multiplier = 1.725;
      break;
    default:
      multiplier = 1.55;
  }
  return bmr * multiplier;
}

function calculateTargetCalories(profileData) {
  const tdee = calculateTDEE(profileData);
  switch (profileData.tujuan) {
    case "turun":
      return tdee * 0.85;
    case "naik":
      return tdee * 1.15;
    case "seimbang":
    default:
      return tdee;
  }
}

function getBMIStatus(bmi) {
  if (bmi < 18.5) return "Berat Badan Kurang";
  if (bmi < 25) return "Berat Badan Normal";
  if (bmi < 30) return "Berat Badan Berlebih";
  return "Obesitas";
}

function getBMIColor(bmi) {
  if (bmi < 18.5) return "#ff6b6b";
  if (bmi < 25) return "#51cf66";
  if (bmi < 30) return "#ffd43b";
  return "#ff6b6b";
}

function getActivityLabel(activity) {
  const labels = {
    ringan: "Ringan (Jarang olahraga)",
    sedang: "Sedang (Olahraga 3-5x seminggu)",
    berat: "Berat (Olahraga setiap hari)",
  };
  return labels[activity] || activity;
}

function getGoalLabel(goal) {
  const labels = {
    naik: "Menaikkan Berat Badan",
    turun: "Menurunkan Berat Badan",
    seimbang: "Menyeimbangkan Berat Badan",
  };
  return labels[goal] || goal;
}

async function handleSaveLaporan(profileData, recommendations) {
  const saveBtn = document.getElementById("saveBtn");
  const originalText = saveBtn.textContent;

  try {
    saveBtn.disabled = true;
    saveBtn.textContent = "💾 Menyimpan...";

    // Siapkan data untuk dikirim
    const user_profile = {
      nama_user: profileData.nama || "User",
      email_user: profileData.email || "",
      usia: profileData.usia,
      berat_badan: profileData.berat,
      tinggi_badan: profileData.tinggi,
      bmi: profileData.berat / ((profileData.tinggi / 100) ** 2),
      jenis_kelamin: profileData.jenis_kelamin,
      aktivitas: profileData.aktivitas,
      tujuan: profileData.tujuan,
      kategori: profileData.kategori || "all",
      bmr: calculateBMR(profileData),
      tdee: calculateTDEE(profileData),
      target_calories: calculateTargetCalories(profileData),
    };

    // Get target nutrients dari sessionStorage
    const resultsData = JSON.parse(sessionStorage.getItem("rekomendasiResults") || "{}");
    const target_nutrients = resultsData.targetNutrients || {
      protein_g: 0,
      lemak_g: 0,
      karbohidrat_g: 0,
    };

    console.log("Saving laporan:", {
      user_profile,
      target_nutrients,
      recommendations_count: recommendations.length,
    });

    // Call API (tanpa user_id)
    const result = await saveRekomendasiReport(
      user_profile,
      target_nutrients,
      recommendations,
      `Rekomendasi dibuat pada ${new Date().toLocaleString("id-ID")}`
    );

    if (result.success) {
      await Swal.fire({
        title: "Berhasil!",
        html: `<p>Laporan berhasil disimpan</p><p><strong>ID Laporan: ${result.rekomendasi_id}</strong></p><p>Anda akan diarahkan ke halaman Laporan...</p>`,
        icon: "success",
        confirmButtonColor: "#10b981",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        didClose: () => {
          // Clear session storage
          sessionStorage.removeItem("rekomendasiResults");
          
          // Redirect ke laporan
          window.location.href = "/petugas/laporan";
        }
      });
    } else {
      throw new Error(result.message || "Gagal menyimpan laporan");
    }
  } catch (error) {
    console.error("Error saving laporan:", error);
    await Swal.fire({
      title: "Gagal!",
      text: error.message || "Gagal menyimpan laporan",
      icon: "error",
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Kembali"
    });
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = originalText;
  }
}
