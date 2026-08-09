import "../../styles/petugas-css/laporan.css";
import Swal from "sweetalert2";
import { getUserData, getLaporanList, getLaporanDetail, deleteLaporan as deleteRekomendasiAPI } from "../../api/backend.js";
// PERBAIKAN IMPORT
import { renderPetugasSidebar, setupPetugasSidebarLogout } from "../../components/sidebar-petugas.js";

// State untuk menyimpan data laporan
let LAPORAN_STATE = {
  all: [],
  filtered: [],
};

export function renderPetugasLaporan(root) { // Rename fungsi export
  const user = getUserData();

  // CEK ROLE: Ahli Gizi
  if (!user || user.role !== "ahli_gizi") {
    window.location.href = "/login";
    return;
  }

  root.innerHTML = `
    <div class="laporan-wrapper">
        ${renderPetugasSidebar('laporan')}
        
        <main class="laporan-main-content">
          <div class="laporan-topbar">
            <div class="laporan-topbar-left">
              <button class="laporan-toggle-sidebar" id="toggleSidebar">☰</button>
              <div class="laporan-topbar-title">
                <h1>Laporan</h1>
                <p>Laporan analisis gizi masyarakat</p>
              </div>
            </div>
            <div class="laporan-topbar-user">
              <div class="laporan-user-avatar">${user.nama?.charAt(0).toUpperCase()}</div>
              <div class="laporan-user-info">
                <p class="laporan-user-name">${user.nama}</p>
                <p class="laporan-user-role">Petugas Gizi</p>
              </div>
            </div>
          </div>

          <div class="laporan-dashboard-content">
            <!-- Overview Cards -->
            <div class="laporan-overview-cards">
              <div class="laporan-overview-card">
                <div class="laporan-card-icon">📋</div>
                <div class="laporan-card-content">
                  <h3>Total Laporan</h3>
                  <p class="laporan-card-value" id="totalLaporan">0</p>
                </div>
              </div>
              <div class="laporan-overview-card">
                <div class="laporan-card-icon">✅</div>
                <div class="laporan-card-content">
                  <h3>Laporan Aktif</h3>
                  <p class="laporan-card-value" id="activeLaporan">0</p>
                </div>
              </div>
            </div>

            <!-- Laporan Table Section -->
            <div class="laporan-table-section">
              <div class="laporan-table-header">
                <h2>Daftar Laporan Rekomendasi Gizi</h2>
                <div class="laporan-search-container">
                  <input
                    type="text"
                    id="laporanSearchInput"
                    class="laporan-search-input"
                    placeholder="🔍 Cari nama atau email user..."
                  />
                </div>
              </div>
              
              <div class="laporan-table-responsive">
                <table class="laporan-table">
                  <thead>
                    <tr>
                      <th>Nama User</th>
                      <th>Email</th>
                      <th>Usia</th>
                      <th>Tujuan</th>
                      <th>Target Kalori</th>
                      <th>Jumlah Makanan</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                      <th style="text-align:center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody id="laporanTable">
                    <tr>
                      <td colspan="10" style="text-align: center; padding: 2rem;"><div class="laporan-loading">Memuat laporan...</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
    </div>

    <!-- Modal Detail Laporan -->
    <div class="laporan-modal" id="detailModal">
      <div class="laporan-modal-content">
        <button class="laporan-modal-close" id="closeModal">X</button>
        <div class="laporan-modal-body" id="modalBody">
          <!-- Detail akan di-load di sini -->
        </div>
      </div>
    </div>
  `;

  setupPetugasLaporanEvents();
  setupPetugasSidebarLogout();
  loadLaporanData();
}

function setupPetugasLaporanEvents() {
  const toggleSidebarBtn = document.getElementById("toggleSidebar");
  const sidebar = document.getElementById("petugasSidebar");
  const closeModalBtn = document.getElementById("closeModal");
  const modal = document.getElementById("detailModal");
  const searchInput = document.getElementById("laporanSearchInput");

  if (toggleSidebarBtn && sidebar) {
    toggleSidebarBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  }

  // Search input listener
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      filterLaporanByName(query);
    });
  }
}

async function loadLaporanData() {
  try {
    const laporanList = await getLaporanList();
    LAPORAN_STATE.all = laporanList;
    LAPORAN_STATE.filtered = laporanList;
    renderLaporanTable(LAPORAN_STATE.filtered);
    updateLaporanStats(laporanList);
  } catch (error) {
    console.error('Error loading laporan:', error);
    const table = document.getElementById("laporanTable");
    if (table) {
      table.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 2rem; color: #e53e3e;">
            Error memuat laporan. Silakan coba lagi nanti.
          </td>
        </tr>
      `;
    }
  }
}

function filterLaporanByName(query) {
  if (!query) {
    LAPORAN_STATE.filtered = LAPORAN_STATE.all;
  } else {
    LAPORAN_STATE.filtered = LAPORAN_STATE.all.filter((laporan) =>
      (laporan.nama_user || "").toLowerCase().includes(query) ||
      (laporan.email_user || "").toLowerCase().includes(query)
    );
  }
  renderLaporanTable(LAPORAN_STATE.filtered);
}

function renderLaporanTable(laporanList) {
  const tableBody = document.getElementById("laporanTable");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (!laporanList || laporanList.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 2rem; color: #a0aec0;">
          Belum ada laporan. Buat rekomendasi terlebih dahulu.
        </td>
      </tr>
    `;
    return;
  }

  laporanList.forEach((laporan) => {
    const row = document.createElement("tr");
    const statusClass = laporan.status === "aktif" ? "laporan-status-aktif" : "laporan-status-arsip";
    const tanggal = new Date(laporan.created_at).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    row.innerHTML = `
      <td><strong>${laporan.nama_user || "N/A"}</strong></td>
      <td><code>${laporan.email_user || "N/A"}</code></td>
      <td>${laporan.usia || "N/A"} tahun</td>
      <td>
        <span class="laporan-badge laporan-badge-${laporan.tujuan}">
          ${laporan.tujuan === "turun" ? "Turun BB" : laporan.tujuan === "naik" ? "Naik BB" : "Seimbang"}
        </span>
      </td>
      <td>${Math.round(laporan.target_calories || 0)} kkal</td>
      <td><strong>${laporan.total_makanan}</strong> item</td>
      <td>
        <span class="laporan-status ${statusClass}">
          ${laporan.status === "aktif" ? "Aktif" : "📁 Arsip"}
        </span>
      </td>
      <td>${tanggal}</td>
      <td id="laporanActions">
        <button class="laporan-btn-detail" onclick="window.showLaporanDetail(${laporan.id})">
          Detail
        </button>
        <button class="laporan-btn-delete" onclick="window.deleteLaporan(${laporan.id})" title="Hapus laporan">
          🗑️
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function updateLaporanStats(laporanList) {
  const total = laporanList.length;
  const active = laporanList.filter(l => l.status === "aktif").length;

  const elTotal = document.getElementById("totalLaporan");
  const elActive = document.getElementById("activeLaporan");

  if (elTotal) elTotal.textContent = total;
  if (elActive) elActive.textContent = active;
}

// Function untuk menampilkan detail laporan
window.showLaporanDetail = async function (laporanId) {
  try {
    const modal = document.getElementById("detailModal");
    const modalBody = document.getElementById("modalBody");

    // Show loading
    modalBody.innerHTML = `<div class="laporan-modal-loading">Memuat detail laporan...</div>`;
    modal.classList.add("active");

    // Get detail
    const result = await getLaporanDetail(laporanId);
    const { rekomendasi, detail_makanan } = result;

    // Render detail
    let html = `
      <h2>Detail Laporan Rekomendasi</h2>
      
      <div class="laporan-detail-grid">
        <div class="laporan-detail-group">
          <h3>Profil Pengguna</h3>
          <div class="laporan-detail-row">
            <span>Nama</span>
            <strong>${rekomendasi.nama_user}</strong>
          </div>
          <div class="laporan-detail-row">
            <span>Usia</span>
            <strong>${rekomendasi.usia} tahun</strong>
          </div>
          <div class="laporan-detail-row">
            <span>Berat Badan</span>
            <strong>${rekomendasi.berat_badan} kg</strong>
          </div>
          <div class="laporan-detail-row">
            <span>Tinggi Badan</span>
            <strong>${rekomendasi.tinggi_badan} cm</strong>
          </div>
          <div class="laporan-detail-row">
            <span>BMI</span>
            <strong>${rekomendasi.bmi ? parseFloat(rekomendasi.bmi).toFixed(1) : "N/A"}</strong>
          </div>
          <div class="laporan-detail-row">
            <span>Jenis Kelamin</span>
            <strong>${rekomendasi.jenis_kelamin === "pria" ? "Pria" : "Wanita"}</strong>
          </div>
        </div>

        <div class="laporan-detail-group">
          <h3>Hasil Kalkulasi</h3>
          <div class="laporan-detail-row">
            <span>BMR</span>
            <strong>${Math.round(rekomendasi.bmr)} kkal/hari</strong>
          </div>
          <div class="laporan-detail-row">
            <span>TDEE</span>
            <strong>${Math.round(rekomendasi.tdee)} kkal/hari</strong>
          </div>
          <div class="laporan-detail-row">
            <span>Target Kalori</span>
            <strong>${Math.round(rekomendasi.target_calories)} kkal/hari</strong>
          </div>
          <div class="laporan-detail-row">
            <span>Tujuan</span>
            <strong>${rekomendasi.tujuan === "turun" ? "Turun Berat Badan" : rekomendasi.tujuan === "naik" ? "Naik Berat Badan" : "Seimbang"}</strong>
          </div>
          <div class="laporan-detail-row">
            <span>Tingkat Aktivitas</span>
            <strong>${rekomendasi.aktivitas}</strong>
          </div>
        </div>

        <div class="laporan-detail-group">
          <h3>Target Nutrisi</h3>
          <div class="laporan-detail-row">
            <span>Protein</span>
            <strong>${rekomendasi.target_protein_g ? parseFloat(rekomendasi.target_protein_g).toFixed(1) : "N/A"} g</strong>
          </div>
          <div class="laporan-detail-row">
            <span>Lemak</span>
            <strong>${rekomendasi.target_lemak_g ? parseFloat(rekomendasi.target_lemak_g).toFixed(1) : "N/A"} g</strong>
          </div>
          <div class="laporan-detail-row">
            <span>Karbohidrat</span>
            <strong>${rekomendasi.target_karbohidrat_g ? parseFloat(rekomendasi.target_karbohidrat_g).toFixed(1) : "N/A"} g</strong>
          </div>
        </div>
      </div>

      <h3 style="margin-top: 2rem;">Rekomendasi Makanan (${detail_makanan.length} item)</h3>
      <div class="laporan-foods-table">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Makanan</th>
              <th>Energi (kal)</th>
              <th>Protein (g)</th>
              <th>Lemak (g)</th>
              <th>Karbohidrat (g)</th>
              <th>Similarity</th>
            </tr>
          </thead>
          <tbody>
    `;

    detail_makanan.forEach((food) => {
      html += `
        <tr>
          <td style="text-align: center; font-weight: bold;">${food.rank}</td>
          <td>${food.nama_makanan}</td>
          <td style="text-align:center;">${food.energi_kal ? parseFloat(food.energi_kal).toFixed(0) : "N/A"}</td>
          <td style="text-align:center;">${food.protein_g ? parseFloat(food.protein_g).toFixed(1) : "N/A"}</td>
          <td style="text-align:center;">${food.lemak_g ? parseFloat(food.lemak_g).toFixed(1) : "N/A"}</td>
          <td style="text-align:center;">${food.karbohidrat_g ? parseFloat(food.karbohidrat_g).toFixed(1) : "N/A"}</td>
          <td>
            <span class="laporan-similarity-bar">
              <span class="laporan-similarity-fill" style="width: ${(food.similarity_score * 100)}%"></span>
            </span>
            ${(food.similarity_score * 100).toFixed(0)}%
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    modalBody.innerHTML = html;
  } catch (error) {
    console.error('Error loading detail:', error);
    const modalBody = document.getElementById("modalBody");
    if (modalBody) {
      modalBody.innerHTML = `
        <div style="color: #e53e3e; padding: 2rem; text-align: center;">
          Error memuat detail laporan
        </div>
      `;
    }
  }
};

// Function untuk menghapus laporan
window.deleteLaporan = async function (laporanId) {
  try {
    const result = await Swal.fire({
      title: "Hapus Laporan?",
      text: "Laporan yang dihapus tidak dapat dipulihkan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      await deleteRekomendasiAPI(laporanId);
      await Swal.fire({
        title: "Berhasil!",
        text: "Laporan berhasil dihapus",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
      // Reload data
      loadLaporanData();
    }
  } catch (error) {
    console.error('Error deleting laporan:', error);
    await Swal.fire({
      title: "Gagal!",
      text: error.message || "Gagal menghapus laporan",
      icon: "error",
      confirmButtonColor: "#ef4444",
    });
  }
};

