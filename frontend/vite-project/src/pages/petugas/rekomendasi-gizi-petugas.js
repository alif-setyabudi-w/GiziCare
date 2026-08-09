import "../../styles/petugas-css/rekomendasi-gizi.css";
import { getUserData, getRekomendasi } from "../../api/backend.js";
import {
  renderPetugasSidebar,
  setupPetugasSidebarLogout,
} from "../../components/sidebar-petugas.js";

export function renderPetugasRekomendasi(root) {
  const user = getUserData();

  // Cek Role: Harus 'ahli_gizi'
  if (!user || user.role !== "ahli_gizi") {
    window.location.href = "/login";
    return;
  }

  root.innerHTML = `
    <div class="rekomendasi-wrapper">
      <div class="rekomendasi-container">
        ${renderPetugasSidebar("rekomendasi")}

        <main class="rekomendasi-main-content">
          <div class="rekomendasi-topbar">
            <div class="rekomendasi-topbar-left">
              <div class="rekomendasi-topbar-title">
                <h1>Rekomendasi Gizi</h1>
                <p>Berikan rekomendasi nutrisi kepada Pasien berdasarkan profil mereka</p>
              </div>
            </div>
            <div class="rekomendasi-topbar-user">
              <div class="rekomendasi-user-avatar">
                ${user.nama?.charAt(0).toUpperCase()}
              </div>
              <div class="rekomendasi-user-info">
                <p class="rekomendasi-user-name">${user.nama}</p>
                <p class="rekomendasi-user-role">Petugas Gizi</p>
              </div>
            </div>
          </div>

          <div class="rekomendasi-content">
            <div class="rekomendasi-form-section">
              <h2>Form Input Data Pasien</h2>
              <form id="rekomasiForm" class="rekomendasi-form">
                <div class="rekomendasi-form-grid">
                  <!-- Nama -->
                  <div class="rekomendasi-form-group">
                    <label for="nama" class="rekomendasi-label">Nama Pasien</label>
                    <input
                      type="text"
                      id="nama"
                      name="nama"
                      class="rekomendasi-input"
                      placeholder="Masukkan nama lengkap Pasien"
                      required
                    />
                  </div>

                  <!-- Email -->
                  <div class="rekomendasi-form-group">
                    <label for="email" class="rekomendasi-label">Email Pasien</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      class="rekomendasi-input"
                      placeholder="Masukkan email Pasien"
                      required
                    />
                  </div>

                  <!-- Usia -->
                  <div class="rekomendasi-form-group">
                    <label for="usia" class="rekomendasi-label">Usia (tahun) <span class="rekomendasi-required">*Min 18 tahun</span></label>
                    <input
                      type="number"
                      id="usia"
                      name="usia"
                      class="rekomendasi-input"
                      placeholder="Contoh: 25 (minimum 18 tahun)"
                      min="18"
                      max="150"
                      required
                    />
                  </div>

                  <!-- Jenis Kelamin -->
                  <div class="rekomendasi-form-group">
                    <label for="jenisKelamin" class="rekomendasi-label">Jenis Kelamin</label>
                    <select id="jenisKelamin" name="jenisKelamin" class="rekomendasi-select" required>
                      <option value="">-- Pilih Jenis Kelamin --</option>
                      <option value="pria">Pria</option>
                      <option value="wanita">Wanita</option>
                    </select>
                  </div>

                  <!-- Berat Badan -->
                  <div class="rekomendasi-form-group">
                    <label for="beratBadan" class="rekomendasi-label">Berat Badan (kg)</label>
                    <input
                      type="number"
                      id="beratBadan"
                      name="beratBadan"
                      class="rekomendasi-input"
                      placeholder="Contoh: 70"
                      step="0.1"
                      min="1"
                      max="300"
                      required
                    />
                  </div>

                  <!-- Tinggi Badan -->
                  <div class="rekomendasi-form-group">
                    <label for="tinggiBadan" class="rekomendasi-label">Tinggi Badan (cm)</label>
                    <input
                      type="number"
                      id="tinggiBadan"
                      name="tinggiBadan"
                      class="rekomendasi-input"
                      placeholder="Contoh: 170"
                      step="0.1"
                      min="1"
                      max="300"
                      required
                    />
                  </div>

                  <!-- Tingkat Aktivitas -->
                  <div class="rekomendasi-form-group">
                    <label for="aktivitas" class="rekomendasi-label">Tingkat Aktivitas</label>
                    <select id="aktivitas" name="aktivitas" class="rekomendasi-select" required>
                      <option value="">-- Pilih Tingkat Aktivitas --</option>
                      <option value="ringan">Ringan (Jarang olahraga)</option>
                      <option value="sedang">Sedang (Olahraga 3-5x seminggu)</option>
                      <option value="berat">Berat (Olahraga setiap hari)</option>
                    </select>
                  </div>

                  <!-- Tujuan -->
                  <div class="rekomendasi-form-group">
                    <label for="tujuan" class="rekomendasi-label">Tujuan</label>
                    <select id="tujuan" name="tujuan" class="rekomendasi-select" required>
                      <option value="">-- Pilih Tujuan --</option>
                      <option value="naik">Menaikkan Berat Badan</option>
                      <option value="turun">Menurunkan Berat Badan</option>
                      <option value="seimbang">Menyeimbangkan Berat Badan</option>
                    </select>
                  </div>

                  <!-- Kategori (Optional) -->
                  <div class="rekomendasi-form-group">
                    <label for="kategori" class="rekomendasi-label">Kategori</label>
                    <select id="kategori" name="kategori" class="rekomendasi-select">
                      <option value="all">Semua Kategori</option>
                      <option value="Buah">Buah</option>
                      <option value="Sayur">Sayur</option>
                      <option value="Kacang-kacangan">Kacang-kacangan</option>
                      <option value="Mentah">Mentah</option>
                    </select>
                  </div>
                </div>

                <div class="rekomendasi-form-actions">
                  <button type="submit" class="rekomendasi-btn-submit">
                    <span id="submitBtnText">Dapatkan Rekomendasi</span>
                    <span id="submitBtnSpinner" style="display: none;">⏳ Memproses...</span>
                  </button>
                  <button type="reset" class="rekomendasi-btn-reset">Reset Form</button>
                </div>
              </form>
            </div>

            <!-- Alert Messages -->
            <div id="alertMessage" class="rekomendasi-alert" style="display: none;"></div>
          </div>
        </main>
      </div>
    </div>
  `;

  // Setup sidebar logout
  setupPetugasSidebarLogout();

  // Setup form handlers
  setupRekomendasiForm();

  // Auto-fill form jika ada data dari konsultasi
  autoFillFormData();
}

/**
 * Auto-fill form dengan data dari sessionStorage (dari dashboard konsultasi)
 */
function autoFillFormData() {
  try {
    const preFilledData = sessionStorage.getItem("preFilledRekomendasiData");
    
    if (preFilledData) {
      const data = JSON.parse(preFilledData);
      
      // Set nilai ke form fields
      if (data.nama) document.getElementById("nama").value = data.nama;
      if (data.email) document.getElementById("email").value = data.email;
      if (data.usia) document.getElementById("usia").value = data.usia;
      if (data.jenisKelamin) document.getElementById("jenisKelamin").value = data.jenisKelamin;
      if (data.beratBadan) document.getElementById("beratBadan").value = data.beratBadan;
      if (data.tinggiBadan) document.getElementById("tinggiBadan").value = data.tinggiBadan;
      if (data.aktivitas) document.getElementById("aktivitas").value = data.aktivitas;
      if (data.tujuan) document.getElementById("tujuan").value = data.tujuan;
      if (data.kategori) document.getElementById("kategori").value = data.kategori;
      
      // Clear sessionStorage setelah digunakan
      sessionStorage.removeItem("preFilledRekomendasiData");
      
      console.log("Form berhasil di-fill dengan data dari konsultasi");
    }
  } catch (error) {
    console.error("Error auto-filling form:", error);
  }
}

function setupRekomendasiForm() {
  const form = document.getElementById("rekomasiForm");
  const alertMessage = document.getElementById("alertMessage");
  const submitBtn = document.querySelector(".rekomendasi-btn-submit");
  const submitBtnText = document.getElementById("submitBtnText");
  const submitBtnSpinner = document.getElementById("submitBtnSpinner");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form data
    const formData = {
      nama: document.getElementById("nama").value,
      email: document.getElementById("email").value,
      usia: parseInt(document.getElementById("usia").value),
      jenis_kelamin: document.getElementById("jenisKelamin").value,
      berat: parseFloat(document.getElementById("beratBadan").value),
      tinggi: parseFloat(document.getElementById("tinggiBadan").value),
      aktivitas: document.getElementById("aktivitas").value,
      tujuan: document.getElementById("tujuan").value,
      kategori: document.getElementById("kategori").value || "all",
    };

    // Validasi usia minimum 18 tahun
    if (formData.usia < 18) {
      alertMessage.style.display = "block";
      alertMessage.className = "rekomendasi-alert alert-error";
      alertMessage.innerHTML = `
        <div class="alert-content">
          <strong>❌ Perhatian!</strong> Sistem hanya mendukung pengguna dewasa (minimal usia 18 tahun). Pasien harus berusia minimal 18 tahun untuk mendapatkan rekomendasi melalui sistem ini.
        </div>
      `;
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtnText.style.display = "none";
    submitBtnSpinner.style.display = "inline";
    alertMessage.style.display = "none";

    try {
      // Call API
      let recommendations = [];
      try {
        recommendations = await getRekomendasi(formData);
      } catch (apiError) {
        console.warn("API Error:", apiError.message);
        // Gunakan mock data jika API tidak tersedia
        recommendations = generateMockRecommendations(7);
        
        alertMessage.style.display = "block";
        alertMessage.className = "rekomendasi-alert alert-warning";
        alertMessage.innerHTML = `
          <div class="alert-content">
            <strong>⚠️ Info:</strong> Menggunakan data rekomendasi example (backend tidak tersedia)
          </div>
        `;
      }

      // Calculate target macronutrients
      const targetNutrients = calculateTargetMacronutrients(
        formData.berat,
        formData.tinggi,
        formData.usia,
        formData.jenis_kelamin,
        formData.aktivitas,
        formData.tujuan
      );

      // Save results to sessionStorage
      const resultsData = {
        profileData: formData,
        recommendations: recommendations,
        targetNutrients: targetNutrients,
      };
      sessionStorage.setItem("rekomendasiResults", JSON.stringify(resultsData));

      // Navigate to hasil-rekomendasi
      setTimeout(() => {
        window.location.href = "/petugas/hasil-rekomendasi";
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      alertMessage.style.display = "block";
      alertMessage.className = "rekomendasi-alert alert-error";
      alertMessage.innerHTML = `
        <div class="alert-content">
          <strong>❌ Error!</strong> ${error.message || "Terjadi kesalahan saat memproses data"}
        </div>
      `;
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtnText.style.display = "inline";
      submitBtnSpinner.style.display = "none";
    }
  });
}

/**
 * Calculate target macronutrients based on Harris-Benedict formula
 * Uses standard macronutrient distribution:
 * - Protein: 30% of calories (1g = 4 calories)
 * - Fat: 30% of calories (1g = 9 calories)
 * - Carbs: 40% of calories (1g = 4 calories)
 */
function calculateTargetMacronutrients(berat, tinggi, usia, jenis_kelamin, aktivitas, tujuan) {
  // Calculate BMR using Harris-Benedict Formula
  let bmr;
  if (jenis_kelamin === "pria") {
    bmr = 88.362 + 13.397 * berat + 4.799 * tinggi - 5.677 * usia;
  } else {
    bmr = 447.593 + 9.247 * berat + 3.098 * tinggi - 4.33 * usia;
  }

  // Calculate TDEE based on activity level
  let activityMultiplier = 1.55; // Default: sedang
  switch (aktivitas) {
    case "ringan":
      activityMultiplier = 1.375;
      break;
    case "berat":
      activityMultiplier = 1.725;
      break;
  }
  const tdee = bmr * activityMultiplier;

  // Adjust TDEE based on goal
  let targetCalories = tdee;
  switch (tujuan) {
    case "turun":
      targetCalories = tdee * 0.85; // 15% deficit
      break;
    case "naik":
      targetCalories = tdee * 1.15; // 15% surplus
      break;
  }

  // Calculate macronutrients using dynamic distribution based on goal
  let proteinPercent, fatPercent, carbPercent;
  
  switch (tujuan) {
    case "turun":
      proteinPercent = 0.35;
      fatPercent = 0.20;
      carbPercent = 0.45;
      break;
    case "naik":
      proteinPercent = 0.15;
      fatPercent = 0.30;
      carbPercent = 0.55;
      break;
    case "seimbang":
    default:
      proteinPercent = 0.25;
      fatPercent = 0.25;
      carbPercent = 0.50;
  }

  const proteinCalories = targetCalories * proteinPercent;
  const fatCalories = targetCalories * fatPercent;
  const carbCalories = targetCalories * carbPercent;

  // Calculate calories per meal (dibagi 4 kali makan sehari: breakfast, lunch, dinner, snack)
  const caloriesPerMeal = Math.round(targetCalories / 4);
  
  // Macronutrients per meal (dibagi 4)
  const proteinPerMeal = Math.round((proteinCalories / 4) / 4 * 10) / 10;
  const fatPerMeal = Math.round((fatCalories / 4) / 9 * 10) / 10;
  const carbsPerMeal = Math.round((carbCalories / 4) / 4 * 10) / 10;

  return {
    calories: Math.round(targetCalories),
    caloriesPerMeal: caloriesPerMeal,
    protein_g: Math.round(proteinCalories / 4 * 10) / 10,  // 1 protein = 4 cal (daily)
    lemak_g: Math.round(fatCalories / 9 * 10) / 10,         // 1 fat = 9 cal (daily)
    karbohidrat_g: Math.round(carbCalories / 4 * 10) / 10,  // 1 carb = 4 cal (daily)
    // Per meal values untuk KNN calculation
    protein_g_per_meal: proteinPerMeal,
    lemak_g_per_meal: fatPerMeal,
    karbohidrat_g_per_meal: carbsPerMeal,
  };
}

/**
 * Generate mock recommendations for testing/demo purposes
 */
function generateMockRecommendations(jumlah = 7) {
  const mockFoods = [
    {
      nama: "Nasi Putih",
      kode: "NPT001",
      energi: 180,
      protein: 3.6,
      lemak: 0.3,
      karbohidrat: 40,
      similarity: 0.95,
    },
    {
      nama: "Telur Rebus",
      kode: "TLR001",
      energi: 155,
      protein: 13,
      lemak: 11,
      karbohidrat: 1.1,
      similarity: 0.88,
    },
    {
      nama: "Daging Ayam Goreng",
      kode: "DAG001",
      energi: 320,
      protein: 30,
      lemak: 21,
      karbohidrat: 0,
      similarity: 0.85,
    },
    {
      nama: "Sayur Bayam",
      kode: "SBY001",
      energi: 23,
      protein: 2.7,
      lemak: 0.4,
      karbohidrat: 3.7,
      similarity: 0.82,
    },
    {
      nama: "Buah Pisang",
      kode: "BPS001",
      energi: 89,
      protein: 1.1,
      lemak: 0.3,
      karbohidrat: 23,
      similarity: 0.79,
    },
    {
      nama: "Tahu Goreng",
      kode: "THG001",
      energi: 150,
      protein: 15.7,
      lemak: 8.7,
      karbohidrat: 1.7,
      similarity: 0.76,
    },
    {
      nama: "Wortel Rebus",
      kode: "WRB001",
      energi: 41,
      protein: 0.9,
      lemak: 0.2,
      karbohidrat: 10,
      similarity: 0.73,
    },
    {
      nama: "Ikan Bakar",
      kode: "IBK001",
      energi: 206,
      protein: 22,
      lemak: 12,
      karbohidrat: 0,
      similarity: 0.70,
    },
    {
      nama: "Kangkung Tumis",
      kode: "KGT001",
      energi: 53,
      protein: 2.3,
      lemak: 3.4,
      karbohidrat: 3.8,
      similarity: 0.67,
    },
    {
      nama: "Susu Sapi",
      kode: "SUS001",
      energi: 61,
      protein: 3.2,
      lemak: 3.3,
      karbohidrat: 4.8,
      similarity: 0.65,
    },
  ];

  // Return jumlah rekomendasi sesuai request
  return mockFoods.slice(0, Math.min(jumlah, mockFoods.length));
}
