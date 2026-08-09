import "../../styles/petugas-css/konsultasi-response.css";
import { getUserData, getKonsultasiDetail, updateKonsultasiStatus, getRekomendasi, saveRekomendasiReport, getAvailableLaporanForUser, giveRekomendasiToUser } from "../../api/backend.js";
import { renderPetugasSidebar, setupPetugasSidebarLogout } from "../../components/sidebar-petugas.js";
import { escapeHTML } from "../../utils/escapeHTML.js";
import Swal from "sweetalert2";

export async function renderKonsultasiResponse(root) {
  const user = getUserData();

  // Cek Role: Harus 'ahli_gizi'
  if (!user || user.role !== "ahli_gizi") {
    window.location.href = "/login";
    return;
  }

  // Get konsultasi ID dari URL params
  const params = new URLSearchParams(window.location.search);
  const konsultasiId = params.get("id");

  if (!konsultasiId) {
    root.innerHTML = `
      <div style="padding: 2rem; text-align: center;">
        <h2>❌ Error: ID Konsultasi tidak ditemukan</h2>
        <p><a href="/petugas/dashboard">Kembali ke Dashboard</a></p>
      </div>
    `;
    return;
  }

  root.innerHTML = `
    <div class="konsultasi-response-wrapper">
      ${renderPetugasSidebar("konsultasi")}
      
      <main class="konsultasi-response-main">
        <div class="konsultasi-response-topbar">
          <div class="response-topbar-left">
            <a href="/petugas/dashboard" class="btn-back">← Kembali</a>
            <div class="response-topbar-title">
              <h1>📋 Respons Konsultasi User</h1>
              <p>Berikan rekomendasi dan respons untuk request konsultasi</p>
            </div>
          </div>
          <div class="response-topbar-user">
            <div class="response-user-avatar">
              ${user.nama?.charAt(0).toUpperCase()}
            </div>
            <div class="response-user-info">
              <p class="response-user-name">${user.nama}</p>
              <p class="response-user-role">Petugas</p>
            </div>
          </div>
        </div>

        <div class="konsultasi-response-content">
          <div id="loadingState" class="loading-state">
            <p>⏳ Memuat data konsultasi...</p>
          </div>
          <div id="contentArea" style="display: none;">
            <!-- Content akan diisi dengan JavaScript -->
          </div>
        </div>
      </main>
    </div>

    <!-- Modal Beri Rekomendasi -->
    <div class="modal modal-rekomendasi" id="rekoModal" style="display: none;">
      <div class="modal-overlay" onclick="closeRekoModal()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>🍽️ Beri Rekomendasi Gizi</h2>
          <button class="modal-close" onclick="closeRekoModal()">×</button>
        </div>
        <div class="modal-body" id="rekoModalBody">
          <!-- Form akan di-load di sini -->
        </div>
      </div>
    </div>
  `;

  setupPetugasSidebarLogout();
  await loadKonsultasiDetail(konsultasiId, root);
}

async function loadKonsultasiDetail(konsultasiId, root) {
  try {
    const konsultasi = await getKonsultasiDetail(konsultasiId);
    const loadingState = document.getElementById("loadingState");
    const contentArea = document.getElementById("contentArea");

    if (loadingState) loadingState.style.display = "none";
    if (contentArea) contentArea.style.display = "block";

    // Hitung data gizi
    const tdee = calculateTDEE(
      konsultasi.berat,
      konsultasi.tinggi,
      konsultasi.usia,
      konsultasi.jenis_kelamin,
      konsultasi.aktivitas
    );

    // Format tanggal
    const createdDate = new Date(konsultasi.created_at).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const statusBadge = {
      pending: '<span class="status-badge status-pending">⏳ Pending</span>',
      diproses: '<span class="status-badge status-processing">🔄 Diproses</span>',
      selesai: '<span class="status-badge status-completed">✅ Selesai</span>',
      ditolak: '<span class="status-badge status-rejected">❌ Ditolak</span>',
    };

    const html = `
      <div class="konsultasi-response-grid">
        
        <!-- Section 1: User Profile -->
        <div class="response-section user-profile-section">
          <h2>👤 Profil User</h2>
          <div class="profile-card">
            <div class="profile-row">
              <span class="profile-label">Nama:</span>
              <span class="profile-value">${escapeHTML(konsultasi.nama)}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Email:</span>
              <span class="profile-value">${escapeHTML(konsultasi.email)}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Usia:</span>
              <span class="profile-value">${escapeHTML(String(konsultasi.usia))} tahun</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Jenis Kelamin:</span>
              <span class="profile-value">${escapeHTML(konsultasi.jenis_kelamin)}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Tanggal Request:</span>
              <span class="profile-value">${escapeHTML(createdDate)}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Status:</span>
              <span class="profile-value">${statusBadge[konsultasi.status]}</span>
            </div>
          </div>
        </div>

        <!-- Section 2: Data Gizi -->
        <div class="response-section nutrition-section">
          <h2>📊 Data Gizi & Kalkulasi</h2>
          <div class="nutrition-card">
            <div class="nutrition-row">
              <span class="nutrition-label">Berat Badan:</span>
              <span class="nutrition-value">${escapeHTML(String(konsultasi.berat))} kg</span>
            </div>
            <div class="nutrition-row">
              <span class="nutrition-label">Tinggi Badan:</span>
              <span class="nutrition-value">${escapeHTML(String(konsultasi.tinggi))} cm</span>
            </div>
            <div class="nutrition-row">
              <span class="nutrition-label">Aktivitas:</span>
              <span class="nutrition-value">${escapeHTML(konsultasi.aktivitas)}</span>
            </div>
            <div class="nutrition-row">
              <span class="nutrition-label">Tujuan:</span>
              <span class="nutrition-value">${escapeHTML(konsultasi.tujuan)}</span>
            </div>
            <div class="nutrition-row">
              <span class="nutrition-label">Target TDEE:</span>
              <span class="nutrition-value nutrition-highlight">${Math.round(tdee)} Kcal/hari</span>
            </div>
            ${
              konsultasi.kategori
                ? `<div class="nutrition-row">
                <span class="nutrition-label">Preferensi Kategori:</span>
                <span class="nutrition-value">${escapeHTML(konsultasi.kategori)}</span>
              </div>`
                : ""
            }
          </div>
        </div>

        <!-- Section 3: Catatan/Pesan -->
        ${
          konsultasi.catatan
            ? `<div class="response-section notes-section">
          <h2>💬 Catatan dari User</h2>
          <div class="notes-card">
            <p>${escapeHTML(konsultasi.catatan)}</p>
          </div>
        </div>`
            : ""
        }

        <!-- Section 4: Response Form -->
        <div class="response-section response-form-section">
          <h2>✍️ Respons Konsultasi</h2>
          <form id="responseForm" class="response-form">
            <div class="form-group">
              <label for="status" class="form-label">Status Konsultasi *</label>
              <select id="status" name="status" class="form-control" required>
                <option value="">-- Pilih Status --</option>
                <option value="selesai" selected>✅ Selesai</option>
              </select>
            </div>

            <div class="form-group">
              <label for="respons" class="form-label">Respons/Rekomendasi *</label>
              <textarea
                id="respons"
                name="respons"
                class="form-control form-textarea"
                placeholder="Berikan rekomendasi gizi dan saran untuk user..."
                rows="6"
                required
              ></textarea>
              <div class="char-count">
                <span id="charCount">0</span> / 2000 karakter
              </div>
            </div>

            <!-- Notif wajib pilih rekomendasi -->
            <div id="rekoRequiredNotice" class="reko-required-notice">
              <span class="reko-required-icon">⚠️</span>
              <span>Anda wajib memilih rekomendasi terlebih dahulu sebelum mengirim respons.</span>
              <button type="button" class="btn-beri-reko btn-beri-reko-inline" onclick="openRekoModal(${konsultasi.user_id}, '${konsultasi.email}')">
                🍽️ Beri Rekomendasi Sekarang
              </button>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-submit" id="submitBtn" disabled>
                <span id="submitText">📤 Kirim Respons</span>
                <span id="submitSpinner" style="display: none;">⏳ Mengirim...</span>
              </button>
              <button type="button" class="btn-beri-reko" onclick="openRekoModal(${konsultasi.user_id}, '${konsultasi.email}')">
                🍽️ Beri Rekomendasi
              </button>
              <button type="button" class="btn-cancel" onclick="window.history.back()">
                ❌ Batal
              </button>
            </div>

            <!-- Preview Rekomendasi yang dipilih -->
            <div id="rekoPreviewSection" style="display: none; margin-top: 1.5rem; padding: 1.5rem; background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 0.5rem;">
              <h3 style="color: #0369a1; margin-bottom: 1rem;">✓ Rekomendasi Terpilih</h3>
              <div id="rekoPreviewContent" style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;"></div>
              <div style="display: flex; gap: 1rem;">
                <button type="button" class="btn-batalkan-reko" onclick="batalkanRekomendasi()">❌ Batalkan</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;

    contentArea.innerHTML = html;
    setupResponseForm(konsultasiId);

    // Character counter
    const textarea = document.getElementById("respons");
    const charCount = document.getElementById("charCount");
    if (textarea && charCount) {
      textarea.addEventListener("input", () => {
        charCount.textContent = textarea.value.length;
      });
    }
  } catch (error) {
    console.error("Error loading konsultasi detail:", error);
    const loadingState = document.getElementById("loadingState");
    const contentArea = document.getElementById("contentArea");

    if (loadingState) {
      loadingState.innerHTML = `
        <div style="color: #dc2626;">
          <p>❌ Error: ${error.message}</p>
          <p><a href="/petugas/dashboard" style="color: #2563eb;">Kembali ke Dashboard</a></p>
        </div>
      `;
    }
  }
}

// ===== GLOBAL VARIABLES FOR REKOMENDASI PREVIEW =====
let selectedRekoData = null;
let selectedRekoUserId = null;

async function submitGiveRekomendasi(rekoId, userId) {
  try {
    // Get laporan details untuk preview
    const laporanList = await getAvailableLaporanForUser(userId);
    const selectedLaporan = laporanList.find(l => l.id == rekoId);

    if (!selectedLaporan) {
      throw new Error("Rekomendasi tidak ditemukan");
    }

    // Store data untuk nanti
    selectedRekoData = selectedLaporan;
    selectedRekoUserId = userId;

    // Tampilkan preview
    showRekoPreview(selectedLaporan);

    // Close modal
    window.closeRekoModal();
  } catch (error) {
    console.error("Error in submitGiveRekomendasi:", error);
    Swal.fire("Error", error.message || "Gagal memproses rekomendasi", "error");
  }
}

function showRekoPreview(laporan) {
  const previewSection = document.getElementById("rekoPreviewSection");
  const previewContent = document.getElementById("rekoPreviewContent");

  const createdDate = new Date(laporan.created_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `
    <div style="line-height: 1.8;">
      <p><strong>👤 User:</strong> ${escapeHTML(laporan.nama_user)}</p>
      <p><strong>📊 BMI:</strong> ${laporan.bmi ? parseFloat(laporan.bmi).toFixed(1) : "N/A"}</p>
      <p><strong>🎯 Target Kalori:</strong> ${laporan.target_calories ? Math.round(laporan.target_calories) : "N/A"} kkal/hari</p>
      <p><strong>🍽️ Jumlah Makanan:</strong> ${laporan.total_makanan} makanan</p>
      <p><strong>📅 Dibuat:</strong> ${escapeHTML(createdDate)}</p>
    </div>
  `;

  previewContent.innerHTML = html;
  previewSection.style.display = "block";

  // Enable submit button & hide notice
  const submitBtn = document.getElementById("submitBtn");
  const notice = document.getElementById("rekoRequiredNotice");
  if (submitBtn) submitBtn.disabled = false;
  if (notice) notice.style.display = "none";
}



window.batalkanRekomendasi = function() {
  // Reset preview
  document.getElementById("rekoPreviewSection").style.display = "none";
  selectedRekoData = null;
  selectedRekoUserId = null;

  // Disable submit button & show notice again
  const submitBtn = document.getElementById("submitBtn");
  const notice = document.getElementById("rekoRequiredNotice");
  if (submitBtn) submitBtn.disabled = true;
  if (notice) notice.style.display = "flex";

  Swal.fire({
    icon: "info",
    title: "Batalkan",
    text: "Rekomendasi telah dibatalkan",
    confirmButtonText: "OK",
  });
};

// Override form submission untuk include rekomendasi
function setupResponseForm(konsultasiId) {
  const form = document.getElementById("responseForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const status = document.getElementById("status").value;
    const respons = document.getElementById("respons").value;

    if (!status || !respons) {
      Swal.fire("Perhatian", "Silakan isi semua field yang diperlukan", "warning");
      return;
    }

    // Wajib pilih rekomendasi
    if (!selectedRekoData) {
      Swal.fire("Perhatian", "Anda harus memilih rekomendasi terlebih dahulu sebelum mengirim respons.", "warning");
      return;
    }

    // Give the rekomendasi
    if (selectedRekoData) {
      // First give the rekomendasi
      const confirmGiveReko = await Swal.fire({
        icon: "question",
        title: "Konfirmasi",
        text: "Berikan rekomendasi kepada user?",
        showCancelButton: true,
        confirmButtonText: "Ya, Berikan",
        cancelButtonText: "Batal",
      });

      if (!confirmGiveReko.isConfirmed) {
        return;
      }

      await submitRealGiveRekomendasi(konsultasiId);
    }

    const submitBtn = form.querySelector("button[type='submit']");
    const submitText = document.getElementById("submitText");
    const submitSpinner = document.getElementById("submitSpinner");

    submitBtn.disabled = true;
    submitText.style.display = "none";
    submitSpinner.style.display = "inline";

    try {
      await updateKonsultasiStatus(konsultasiId, status, respons);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Respons konsultasi telah dikirim",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "/petugas/dashboard";
      });
    } catch (error) {
      console.error("Error updating konsultasi:", error);
      Swal.fire("Error", error.message, "error");
    } finally {
      submitBtn.disabled = false;
      submitText.style.display = "inline";
      submitSpinner.style.display = "none";
    }
  });
}

async function submitRealGiveRekomendasi(konsultasiId) {
  try {
    console.log("[submitRealGiveRekomendasi] giving reko:", selectedRekoData.id, "to user:", selectedRekoUserId, "konsultasi:", konsultasiId);
    
    await giveRekomendasiToUser(selectedRekoData.id, selectedRekoUserId, konsultasiId);

    console.log("[submitRealGiveRekomendasi] Rekomendasi diberikan");
  } catch (error) {
    console.error("Error giving rekomendasi:", error);
    throw error;
  }
}

window.closeRekoModal = function() {
  document.getElementById("rekoModal").style.display = "none";
};

function calculateTDEE(berat, tinggi, usia, jenis_kelamin, aktivitas) {
  // Harris-Benedict Formula untuk BMR
  let bmr;
  if (jenis_kelamin === "pria") {
    bmr = 88.362 + 13.397 * berat + 4.799 * tinggi - 5.677 * usia;
  } else {
    bmr = 447.593 + 9.247 * berat + 3.098 * tinggi - 4.33 * usia;
  }

  // Activity multiplier
  let multiplier = 1.55; // Default: sedang
  switch (aktivitas) {
    case "ringan":
      multiplier = 1.375;
      break;
    case "berat":
      multiplier = 1.725;
      break;
  }

  return bmr * multiplier;
}

function getBMIStatus(bmi) {
  const bmiValue = parseFloat(bmi);
  if (bmiValue < 18.5) return "(Kurus)";
  if (bmiValue < 25) return "(Normal)";
  if (bmiValue < 30) return "(Overweight)";
  return "(Obese)";
}
// ===== FUNGSI MODAL REKOMENDASI =====

window.openRekoModal = function(userId, userEmail) {
  const modalBody = document.getElementById("rekoModalBody");
  
  const html = `
    <div id="rekoLoadingState" style="text-align: center; padding: 2rem;">
      <p>⏳ Memuat daftar rekomendasi yang tersedia...</p>
    </div>
    <div id="rekoContentArea" style="display: none;">
      <!-- Content akan diisi dengan JavaScript -->
    </div>
  `;

  modalBody.innerHTML = html;
  document.getElementById("rekoModal").style.display = "flex";
  
  // Load available laporan
  loadAvailableLaporan(userId, userEmail);
};

async function loadAvailableLaporan(userId, userEmail) {
  try {
    const laporanList = await getAvailableLaporanForUser(userId);
    const loadingState = document.getElementById("rekoLoadingState");
    const contentArea = document.getElementById("rekoContentArea");
    
    if (loadingState) loadingState.style.display = "none";
    if (contentArea) contentArea.style.display = "block";

    // Filter laporan untuk user yang sesuai berdasarkan email
    const filteredLaporan = laporanList.filter(laporan => laporan.email_user === userEmail);

    if (!filteredLaporan || filteredLaporan.length === 0) {
      contentArea.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #a0aec0;">
          <p>❌ Belum ada laporan yang tersedia untuk <strong>${escapeHTML(userEmail)}</strong></p>
          <p style="font-size: 0.9rem; margin-top: 0.5rem;">Mohon buat rekomendasi terlebih dahulu di menu Rekomendasi Gizi</p>
        </div>
      `;
      return;
    }

    let html = `
      <form id="rekoSelectionForm" class="reko-form">
        <div class="form-group">
          <label for="selectedLaporan" class="form-label">Pilih Laporan untuk <strong>${escapeHTML(userEmail)}</strong> *</label>
          <div class="laporan-selection-list">
    `;

    filteredLaporan.forEach((laporan) => {
      const createdDate = new Date(laporan.created_at).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      
      html += `
        <div class="laporan-selection-item">
          <input type="radio" id="laporan_${laporan.id}" name="selectedLaporan" value="${laporan.id}" required>
          <label for="laporan_${laporan.id}" class="laporan-selection-label">
            <div class="laporan-selection-header">
              <strong>${escapeHTML(laporan.email_user || laporan.nama_user)}</strong>
              <span class="laporan-date">${escapeHTML(createdDate)}</span>
            </div>
            <div class="laporan-selection-details">
              <span>📊 BMI: ${laporan.bmi ? parseFloat(laporan.bmi).toFixed(1) : "N/A"}</span>
              <span>🎯 Target: ${laporan.target_calories ? Math.round(laporan.target_calories) : "N/A"} kkal</span>
              <span>🍽️ ${laporan.total_makanan} makanan</span>
            </div>
          </label>
        </div>
      `;
    });

    html += `
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit">
            <span id="giveRekoText">✓ Berikan Rekomendasi</span>
            <span id="giveRekoSpinner" style="display: none;">⏳ Memberikan...</span>
          </button>
          <button type="button" class="btn-cancel" onclick="closeRekoModal()">
            ❌ Batal
          </button>
        </div>
      </form>

      <style>
        .laporan-selection-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 350px;
          overflow-y: auto;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.75rem;
        }

        .laporan-selection-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
          box-sizing: border-box;
        }

        .laporan-selection-item:hover {
          background-color: #f7fafc;
          border-color: #cbd5e0;
        }

        .laporan-selection-item input[type="radio"] {
          flex-shrink: 0;
          cursor: pointer;
        }

        .laporan-selection-item input[type="radio"]:checked + .laporan-selection-label .laporan-selection-header strong {
          color: #2563eb;
        }

        .laporan-selection-label {
          flex: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .laporan-selection-header {
          display: flex;
          flex-direction: column;
          min-width: 100px;
        }

        .laporan-selection-header strong {
          font-size: 0.95rem;
        }

        .laporan-date {
          font-size: 0.78rem;
          color: #718096;
        }

        .laporan-selection-details {
          display: flex;
          flex-direction: row;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: #4a5568;
          flex-wrap: wrap;
        }

        .laporan-selection-details span {
          display: flex;
          align-items: center;
          padding: 0.35rem 0.6rem;
          background-color: #f7fafc;
          border-radius: 4px;
          border-left: 3px solid #8b5cf6;
          white-space: nowrap;
        }
      </style>
    `;

    contentArea.innerHTML = html;

    // Setup form submission
    document.getElementById("rekoSelectionForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const selectedRekoId = document.querySelector("input[name='selectedLaporan']:checked").value;
      await submitGiveRekomendasi(selectedRekoId, userId);
    });
  } catch (error) {
    console.error("Error loading available laporan:", error);
    const contentArea = document.getElementById("rekoContentArea");
    const loadingState = document.getElementById("rekoLoadingState");
    
    if (loadingState) loadingState.style.display = "none";
    if (contentArea) {
      contentArea.style.display = "block";
      contentArea.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #dc2626;">
          <p>❌ Error: ${error.message}</p>
        </div>
      `;
    }
  }
}

window.closeRekoModal = function() {
  document.getElementById("rekoModal").style.display = "none";
};