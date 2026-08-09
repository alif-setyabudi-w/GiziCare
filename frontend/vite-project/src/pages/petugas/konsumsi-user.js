import "../../styles/petugas-css/konsumsi-user.css";
import { getUserData, getAllKonsumsi, deleteKonsumsiItem, getAllUsers } from "../../api/backend.js";
import { renderPetugasSidebar, setupPetugasSidebarLogout } from "../../components/sidebar-petugas.js";
import Swal from "sweetalert2";

export function renderPetugasKonsumsiUser(root) {
  const petugas = getUserData();
  if (!petugas || petugas.role !== "ahli_gizi") {
    window.location.href = "/login";
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  root.innerHTML = `
    <div class="konsumsi-pt-wrapper">
      <div class="konsumsi-pt-container">
        ${renderPetugasSidebar("konsumsi-user")}

        <main class="konsumsi-pt-main">
          <div class="konsumsi-pt-topbar">
            <div class="konsumsi-pt-topbar-title">
              <h1>🍽️ Pola Makan Pengguna</h1>
              <p>Pantau catatan konsumsi makanan harian semua pengguna</p>
            </div>
            <div class="konsumsi-pt-topbar-user">
              <div class="konsumsi-pt-avatar">${petugas.nama?.charAt(0).toUpperCase()}</div>
              <div>
                <p class="konsumsi-pt-user-name">${petugas.nama}</p>
                <p class="konsumsi-pt-user-role">Petugas Gizi</p>
              </div>
            </div>
          </div>

          <div class="konsumsi-pt-content">
            <!-- SUMMARY CARDS -->
            <div class="konsumsi-pt-summary">
              <div class="konsumsi-pt-card">
                <div class="card-icon">👤</div>
                <div class="card-value" id="statUser">-</div>
                <div class="card-label">User Aktif</div>
              </div>
              <div class="konsumsi-pt-card">
                <div class="card-icon">🍽️</div>
                <div class="card-value" id="statTotal">-</div>
                <div class="card-label">Total Entri</div>
              </div>
              <div class="konsumsi-pt-card">
                <div class="card-icon">📅</div>
                <div class="card-value" id="statHari">-</div>
                <div class="card-label">Hari Tercatat</div>
              </div>
            </div>

            <!-- TABLE -->
            <div class="konsumsi-pt-table-card">
              <div class="konsumsi-pt-table-header">
                <h2>📋 Data Konsumsi Pengguna</h2>
                <div class="konsumsi-pt-filters">
                  <select id="filterUser" class="konsumsi-pt-filter-select">
                    <option value="">Semua User</option>
                  </select>
                  <input type="date" id="filterTanggal" class="konsumsi-pt-filter-input" max="${today}" title="Filter tanggal" />
                  <select id="filterWaktu" class="konsumsi-pt-filter-select">
                    <option value="">Semua Waktu</option>
                    <option value="pagi">Pagi</option>
                    <option value="siang">Siang</option>
                    <option value="sore">Sore</option>
                    <option value="malam">Malam</option>
                    <option value="minuman">Minuman</option>
                  </select>
                  <button class="btn-icon" id="btnRefresh" title="Refresh data" style="background:#ebf8ff;color:#2b6cb0;width:auto;padding:0 0.8rem;font-size:0.85rem;border-radius:8px;height:36px;">🔄 Refresh</button>
                </div>
              </div>
              <div class="konsumsi-pt-table-responsive">
                <table class="konsumsi-pt-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Pengguna</th>
                      <th>Tanggal</th>
                      <th>Waktu</th>
                      <th>Makanan / Minuman</th>
                      <th>Porsi</th>
                      <th>Catatan</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody id="tabelKonsumsi">
                    <tr class="empty-row"><td colspan="8">Memuat data...</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `;

  setupPetugasSidebarLogout();

  let allData = [];

  function escHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function formatTanggal(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  }

  function waktuLabel(w) {
    const map = { pagi: "🌅 Pagi", siang: "☀️ Siang", sore: "🌤️ Sore", malam: "🌙 Malam", minuman: "💧 Minuman" };
    return map[w] || w;
  }

  function updateStats(data) {
    const users = new Set(data.map(r => r.user_id)).size;
    const hari = new Set(data.map(r => r.tanggal?.split("T")[0])).size;
    document.getElementById("statUser").textContent = users;
    document.getElementById("statTotal").textContent = data.length;
    document.getElementById("statHari").textContent = hari;
  }

  function renderTable(data) {
    const tbody = document.getElementById("tabelKonsumsi");
    if (!data.length) {
      tbody.innerHTML = `<tr class="empty-row"><td colspan="8">Tidak ada data konsumsi untuk filter yang dipilih.</td></tr>`;
      return;
    }
    tbody.innerHTML = data.map((row, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><span class="user-badge-pt">👤 ${escHtml(row.nama_user || "-")}</span></td>
        <td>${formatTanggal(row.tanggal)}</td>
        <td><span class="waktu-badge waktu-${row.waktu_makan}">${waktuLabel(row.waktu_makan)}</span></td>
        <td><strong>${escHtml(row.nama_makanan)}</strong></td>
        <td>${escHtml(row.porsi || "-")}</td>
        <td>${escHtml(row.catatan || "-")}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon delete" title="Hapus" onclick="ptHapusKonsumsi(${row.id})">🗑️</button>
          </div>
        </td>
      </tr>
    `).join("");
  }

  // ===== POPULATE USER DROPDOWN FILTER =====
  function populateUserFilter(data) {
    const sel = document.getElementById("filterUser");
    const existing = sel.querySelectorAll("option:not([value=''])");
    existing.forEach(o => o.remove());

    const users = {};
    data.forEach(r => { if (r.user_id && r.nama_user) users[r.user_id] = r.nama_user; });
    Object.entries(users).forEach(([id, nama]) => {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = nama;
      sel.appendChild(opt);
    });
  }

  // ===== LOAD DATA =====
  async function loadData() {
    const userId = document.getElementById("filterUser").value || null;
    const tanggal = document.getElementById("filterTanggal").value || null;

    try {
      const res = await getAllKonsumsi(userId, tanggal);
      allData = res.data || [];
      populateUserFilter(allData);
      applyWaktuFilter();
      updateStats(allData);
    } catch {
      renderTable([]);
    }
  }

  function applyWaktuFilter() {
    const waktu = document.getElementById("filterWaktu").value;
    const filtered = waktu ? allData.filter(r => r.waktu_makan === waktu) : allData;
    renderTable(filtered);
  }

  // Filter events
  document.getElementById("filterUser").addEventListener("change", loadData);
  document.getElementById("filterTanggal").addEventListener("change", loadData);
  document.getElementById("filterWaktu").addEventListener("change", applyWaktuFilter);
  document.getElementById("btnRefresh").addEventListener("click", loadData);

  // ===== HAPUS =====
  window.ptHapusKonsumsi = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus Data?",
      text: "Data konsumsi pengguna ini akan dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonText: "Batal",
      confirmButtonText: "Ya, Hapus",
    });
    if (!confirm.isConfirmed) return;

    try {
      await deleteKonsumsiItem(id);
      Swal.fire({ icon: "success", title: "Terhapus!", text: "Data berhasil dihapus.", timer: 1500, showConfirmButton: false });
      await loadData();
    } catch (err) {
      Swal.fire("Gagal", err.message || "Terjadi kesalahan.", "error");
    }
  };

  loadData();
}