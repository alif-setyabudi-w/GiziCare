import "../../styles/petugas-css/dashboard.css";
import { getUserData, getDashboardStats, getKonsultasiList } from "../../api/backend.js";
import { escapeHTML } from "../../utils/escapeHTML.js";
import { renderPetugasSidebar, setupPetugasSidebarLogout } from "../../components/sidebar-petugas.js";

export async function renderPetugasDashboard(root) {
  const user = getUserData();

  // Cek Role
  if (!user || user.role !== "ahli_gizi") {
    window.location.href = "/login";
    return;
  }

  // Render Struktur Awal (Loading State)
  root.innerHTML = `
    <div class="petugas-wrapper">
        ${renderPetugasSidebar('dashboard')}
        
        <main class="petugas-main-content">
          <div class="petugas-topbar">
            <div class="topbar-welcome">
              <h1>📊 Dashboard Ahli Gizi</h1>
              <p style="color: #ffff;">Selamat datang kembali, <strong>${escapeHTML(user.nama)}</strong></p>
            </div>
          </div>

          <div class="petugas-dashboard-content">
            
            <div class="stats-grid">
              <div class="stat-card blue">
                <div class="stat-icon">👥</div>
                <div class="stat-info">
                  <h3>Total User</h3>
                  <p class="stat-value" id="totalUsers">
                    <span class="loading-skeleton"></span>
                  </p>
                  <span class="stat-desc">Pengguna Terdaftar</span>
                </div>
              </div>

              <div class="stat-card purple">
                <div class="stat-icon">📄</div>
                <div class="stat-info">
                  <h3>Request User</h3> 
                  <p class="stat-value" id="totalKonsultasi">
                    <span class="loading-skeleton"></span>
                  </p>
                  <span class="stat-desc">Permintaan Masuk</span>
                </div>
              </div>
            </div>

            <div class="dashboard-section">
              <h2>📋 Aktivitas Terbaru</h2>
              <div class="activity-list" id="activityList">
                <div class="empty-state">
                  <p>⏳ Memuat data aktivitas...</p>
                </div>
              </div>
            </div>

          </div>
        </main>
    </div>
  `;

  // Add loading animation styles
  const style = document.createElement('style');
  style.textContent = `
    .loading-skeleton {
      display: inline-block;
      width: 60px;
      height: 32px;
      background: linear-gradient(90deg, #e2e8f0, #f1f5f9, #e2e8f0);
      background-size: 200% 100%;
      animation: skeleton-load 1.5s infinite;
      border-radius: 4px;
    }

    @keyframes skeleton-load {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);

  setupPetugasSidebarLogout();

  // === AMBIL DATA DARI DATABASE ===
  try {
    const stats = await getDashboardStats();

    // Update UI dengan data asli
    const elTotalUsers = document.getElementById("totalUsers");

    if (elTotalUsers) {
      elTotalUsers.textContent = stats.totalUsers || 0;
    }

    // === LOAD KONSULTASI ===
    await loadKonsultasiAktivitas();

  } catch (error) {
    console.error("Gagal memuat statistik:", error);
    // Fallback jika error
    const elTotalUsers = document.getElementById("totalUsers");

    if (elTotalUsers) elTotalUsers.textContent = "-";
  }
}

/**
 * Load dan render aktivitas konsultasi terbaru
 */
async function loadKonsultasiAktivitas() {
  try {
    const konsultasiList = await getKonsultasiList("pending");
    const activityList = document.getElementById("activityList");
    const totalKonsultasi = document.getElementById("totalKonsultasi");

    if (totalKonsultasi) {
      totalKonsultasi.textContent = konsultasiList.length || 0;
    }

    if (!activityList) return;

    if (konsultasiList.length === 0) {
      activityList.innerHTML = `
        <div class="empty-state">
          <p>✨ Belum ada request konsultasi. Tunggu user mengirimkan request.</p>
        </div>
      `;
      return;
    }

    // Urutkan berdasarkan created_at (terbaru pertama)
    const sortedList = konsultasiList.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    // Ambil 5 terbaru
    const recentList = sortedList.slice(0, 5);

    let html = "";
    recentList.forEach((item) => {
      const createdDate = new Date(item.created_at).toLocaleDateString("id-ID", {
        weekday: "short",
        year: "numeric",
        month: "short",
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

      html += `
        <div class="activity-item konsultasi-request">
          <div class="activity-header">
            <div class="activity-title">
              <h3>📨 Konsultasi dari ${escapeHTML(item.nama)}</h3>
              <p class="activity-date">${escapeHTML(createdDate)}</p>
            </div>
            <div class="activity-status">
              ${statusBadge[item.status] || '<span class="status-badge">Unknown</span>'}
            </div>
          </div>

          <div class="konsultasi-details">
            <div class="detail-row">
              <span style="color:black;" class="detail-label">📧 Email:</span>
              <span class="detail-value">${escapeHTML(item.email)}</span>
            </div>
            <div class="detail-row">
              <span style="color:black;" class="detail-label">👤 Profil:</span>
              <span class="detail-value">${escapeHTML(String(item.usia))} tahun | ${escapeHTML(item.jenis_kelamin)} | ${escapeHTML(String(item.berat))} kg | ${escapeHTML(String(item.tinggi))} cm</span>
            </div>
            <div class="detail-row">
              <span style="color:black;" class="detail-label">📊 Data Gizi:</span>
              <span class="detail-value">
                Aktivitas: ${escapeHTML(item.aktivitas)} | Tujuan: ${escapeHTML(item.tujuan)}
              </span>
            </div>
            ${item.catatan
          ? `<div class="detail-row">
                <span style="color:black;" class="detail-label">💬 Catatan:</span>
                <span class="detail-value">${escapeHTML(item.catatan)}</span>
              </div>`
          : ""
        }
          </div>

          <div class="activity-actions">
            <button class="btn-action btn-respond" onclick="window.location.href='/petugas/konsultasi?id=${item.id}'">
              📝 Respons
            </button>
            <button class="btn-action btn-calculate" onclick="handleKalkulasi(${JSON.stringify(item).replace(/"/g, '&quot;')})">
              🧮 Kalkulasi
            </button>
          </div>
        </div>
      `;
    });

    activityList.innerHTML = html;
  } catch (error) {
    console.error("Error loading konsultasi aktivitas:", error);
    const activityList = document.getElementById("activityList");
    if (activityList) {
      activityList.innerHTML = `
        <div class="empty-state">
          <p>❌ Gagal memuat data request. ${error.message}</p>
        </div>
      `;
    }
  }
}

window.handleKalkulasi = function (konsultasiData) {
  try {
    // Store data to sessionStorage untuk auto-fill di rekomendasi page
    const preFilledData = {
      nama: konsultasiData.nama,
      email: konsultasiData.email,
      usia: konsultasiData.usia,
      jenisKelamin: konsultasiData.jenis_kelamin,
      beratBadan: konsultasiData.berat,
      tinggiBadan: konsultasiData.tinggi,
      aktivitas: konsultasiData.aktivitas,
      tujuan: konsultasiData.tujuan,
      kategori: konsultasiData.kategori || "all",
      konsultasiId: konsultasiData.id // Store konsultasi ID untuk referensi
    };

    sessionStorage.setItem("preFilledRekomendasiData", JSON.stringify(preFilledData));

    // Navigate ke halaman rekomendasi
    window.location.href = "/petugas/rekomendasi";
  } catch (error) {
    console.error("Error:", error);
    alert("Terjadi kesalahan saat memproses data. Silakan coba lagi.");
  }
}