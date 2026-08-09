import "../../styles/user-css/konsultasi-rekomendasi.css";
import { getUserData } from "../../api/backend.js";
import { renderUserSidebar, setupUserSidebarLogout } from "../../components/sidebar-user.js";
import Swal from "sweetalert2";

export function renderUserKonsultasi(root) {
  const user = getUserData();

  // Cek Role: Harus 'pasien'
  if (!user || user.role !== "pasien") {
    window.location.href = "/login";
    return;
  }

  root.innerHTML = `
    <div class="konsultasi-wrapper">
      <div class="konsultasi-container">
        ${renderUserSidebar("konsultasi")}

        <main class="konsultasi-main-content">
          <div class="konsultasi-topbar">
            <div class="konsultasi-topbar-left">
              <div class="konsultasi-topbar-title">
                <h1>Konsultasi Rekomendasi Gizi</h1>
                <p>Ajukan kebutuhan gizi Anda kepada petugas kesehatan profesional</p>
              </div>
            </div>
            <div class="konsultasi-topbar-user">
              <div class="konsultasi-user-info">
                <p class="konsultasi-user-name">${user.nama}</p>
                <p class="konsultasi-user-role">Pasien</p>
              </div>
            </div>
          </div>

          <div class="konsultasi-content">
            <div class="konsultasi-form-section">
              <h2>Form Input Data Diri</h2>
              <p class="konsultasi-form-desc">Lengkapi data berikut agar petugas dapat memberikan rekomendasi yang tepat</p>
              
              <form id="konsultasiForm" class="konsultasi-form">
                <div class="konsultasi-form-grid">
                  <!-- Nama -->
                  <div class="konsultasi-form-group">
                    <label for="nama" class="konsultasi-label">Nama Lengkap</label>
                    <input
                      type="text"
                      id="nama"
                      name="nama"
                      class="konsultasi-input"
                      placeholder="Masukkan nama lengkap Anda"
                      value="${user.nama || ''}"
                      readonly
                    />
                  </div>

                  <!-- Email -->
                  <div class="konsultasi-form-group">
                    <label for="email" class="konsultasi-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      class="konsultasi-input"
                      placeholder="Email Anda"
                      value="${user.email || ''}"
                      readonly
                    />
                  </div>

                  <!-- Usia -->
                  <div class="konsultasi-form-group">
                    <label for="usia" class="konsultasi-label">Usia (tahun) <span class="konsultasi-required">*Min 18 tahun</span></label>
                    <input
                      type="number"
                      id="usia"
                      name="usia"
                      class="konsultasi-input"
                      placeholder="Contoh: 25 (minimum 18 tahun)"
                      min="18"
                      max="150"
                      required
                    />
                  </div>

                  <!-- Jenis Kelamin -->
                  <div class="konsultasi-form-group">
                    <label for="jenisKelamin" class="konsultasi-label">Jenis Kelamin</label>
                    <select id="jenisKelamin" name="jenisKelamin" class="konsultasi-select" required>
                      <option value="">-- Pilih Jenis Kelamin --</option>
                      <option value="pria">Pria</option>
                      <option value="wanita">Wanita</option>
                    </select>
                  </div>

                  <!-- Berat Badan -->
                  <div class="konsultasi-form-group">
                    <label for="beratBadan" class="konsultasi-label">Berat Badan (kg)</label>
                    <input
                      type="number"
                      id="beratBadan"
                      name="beratBadan"
                      class="konsultasi-input"
                      placeholder="Contoh: 70"
                      step="0.1"
                      min="1"
                      max="300"
                      required
                    />
                  </div>

                  <!-- Tinggi Badan -->
                  <div class="konsultasi-form-group">
                    <label for="tinggiBadan" class="konsultasi-label">Tinggi Badan (cm)</label>
                    <input
                      type="number"
                      id="tinggiBadan"
                      name="tinggiBadan"
                      class="konsultasi-input"
                      placeholder="Contoh: 170"
                      step="0.1"
                      min="1"
                      max="300"
                      required
                    />
                  </div>

                  <!-- Tingkat Aktivitas -->
                  <div class="konsultasi-form-group">
                    <label for="aktivitas" class="konsultasi-label">Tingkat Aktivitas</label>
                    <select id="aktivitas" name="aktivitas" class="konsultasi-select" required>
                      <option value="">-- Pilih Tingkat Aktivitas --</option>
                      <option value="ringan">Ringan (Jarang olahraga)</option>
                      <option value="sedang">Sedang (Olahraga 3-5x seminggu)</option>
                      <option value="berat">Berat (Olahraga setiap hari)</option>
                    </select>
                  </div>

                  <!-- Tujuan -->
                  <div class="konsultasi-form-group">
                    <label for="tujuan" class="konsultasi-label">Tujuan Gizi</label>
                    <select id="tujuan" name="tujuan" class="konsultasi-select" required>
                      <option value="">-- Pilih Tujuan --</option>
                      <option value="naik">Menaikkan Berat Badan</option>
                      <option value="turun">Menurunkan Berat Badan</option>
                      <option value="seimbang">Menyeimbangkan Berat Badan</option>
                    </select>
                  </div>

                  <!-- Kategori Makanan (Optional) -->
                  <div class="konsultasi-form-group">
                    <label for="kategori" class="konsultasi-label">Preferensi Kategori (Opsional)</label>
                    <select id="kategori" name="kategori" class="konsultasi-select">
                      <option value="all">Semua Kategori</option>
                      <option value="Buah">Buah</option>
                      <option value="Sayur">Sayur</option>
                      <option value="Kacang-kacangan">Kacang-kacangan</option>
                      <option value="Mentah">Mentah</option>
                    </select>
                  </div>

                  <!-- Catatan Khusus -->
                  <div class="konsultasi-form-group full-width">
                    <label for="catatan" class="konsultasi-label">Catatan Khusus (Opsional)</label>
                    <textarea
                      id="catatan"
                      name="catatan"
                      class="konsultasi-textarea"
                      placeholder="Jelaskan kondisi kesehatan khusus, alergi, atau informasi penting lainnya..."
                      rows="4"
                    ></textarea>
                  </div>
                </div>

                <div class="konsultasi-form-actions">
                  <button type="submit" class="konsultasi-btn-submit">
                    <span id="submitBtnText">💬 Kirim ke Petugas</span>
                    <span id="submitBtnSpinner" style="display: none;">⏳ Mengirim...</span>
                  </button>
                  <button type="reset" class="konsultasi-btn-reset">Reset Form</button>
                </div>
              </form>
            </div>

            <!-- Alert Messages -->
            <div id="alertMessage" class="konsultasi-alert" style="display: none;"></div>
          </div>
        </main>
      </div>
    </div>
  `;

  // Setup sidebar logout
  setupUserSidebarLogout();

  // Setup form handlers
  setupKonsultasiForm();
}

function setupKonsultasiForm() {
  const form = document.getElementById("konsultasiForm");
  const alertMessage = document.getElementById("alertMessage");
  const submitBtn = document.querySelector(".konsultasi-btn-submit");
  const submitBtnText = document.getElementById("submitBtnText");
  const submitBtnSpinner = document.getElementById("submitBtnSpinner");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form data
    const user = getUserData();
    const formData = {
      user_id: user.id,
      nama: user.nama,
      email: user.email,
      usia: parseInt(document.getElementById("usia").value),
      jenis_kelamin: document.getElementById("jenisKelamin").value,
      berat: parseFloat(document.getElementById("beratBadan").value),
      tinggi: parseFloat(document.getElementById("tinggiBadan").value),
      aktivitas: document.getElementById("aktivitas").value,
      tujuan: document.getElementById("tujuan").value,
      kategori: document.getElementById("kategori").value || "all",
      catatan: document.getElementById("catatan").value || "",
      status: "pending",
      created_at: new Date().toISOString(),
    };

    // Validation - Usia minimum 13 tahun
    if (formData.usia < 13) {
      alertMessage.style.display = "block";
      alertMessage.className = "konsultasi-alert alert-error";
      alertMessage.innerHTML = `
        <div class="alert-content">
          <strong>❌ Error!</strong> Sistem hanya mendukung pengguna dewasa (minimal usia 18 tahun). Anda harus berusia minimal 18 tahun untuk menggunakan fitur konsultasi ini.
        </div>
      `;
      return;
    }

    // Validation - Usia range maksimal
    if (formData.usia > 150) {
      alertMessage.style.display = "block";
      alertMessage.className = "konsultasi-alert alert-error";
      alertMessage.innerHTML = `
        <div class="alert-content">
          <strong>❌ Error!</strong> Usia tidak valid (melebihi batas wajar)
        </div>
      `;
      return;
    }

    if (formData.berat < 1 || formData.berat > 300) {
      alertMessage.style.display = "block";
      alertMessage.className = "konsultasi-alert alert-error";
      alertMessage.innerHTML = `
        <div class="alert-content">
          <strong>❌ Error!</strong> Berat badan harus antara 1-300 kg
        </div>
      `;
      return;
    }

    if (formData.tinggi < 50 || formData.tinggi > 300) {
      alertMessage.style.display = "block";
      alertMessage.className = "konsultasi-alert alert-error";
      alertMessage.innerHTML = `
        <div class="alert-content">
          <strong>❌ Error!</strong> Tinggi badan harus antara 50-300 cm
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
      // Call API to submit konsultasi
      const token = sessionStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/konsultasi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      //http://localhost:3000/api/konsultasi

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengirim konsultasi");
      }

      // Show success message
      alertMessage.style.display = "block";
      alertMessage.className = "konsultasi-alert alert-success";
      alertMessage.innerHTML = `
        <div class="alert-content">
          <strong>✅ Berhasil!</strong> Konsultasi Anda telah dikirim ke petugas. Petugas akan merespons dalam 1-2 hari kerja.
        </div>
      `;

      // Reset form
      form.reset();

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "/user/dashboard";
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      alertMessage.style.display = "block";
      alertMessage.className = "konsultasi-alert alert-error";
      alertMessage.innerHTML = `
        <div class="alert-content">
          <strong>❌ Error!</strong> ${error.message || "Terjadi kesalahan saat mengirim konsultasi"}
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
