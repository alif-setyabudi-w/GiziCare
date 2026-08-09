import "../../styles/petugas-css/arsip.css";
import Swal from "sweetalert2";
import {
  getUserData,
  getKonsultasiList,
  getKonsultasiDetail,
  deleteKonsultasi,
} from "../../api/backend.js";
import {
  renderPetugasSidebar,
  setupPetugasSidebarLogout,
} from "../../components/sidebar-petugas.js";

// ─── Pagination state ───────────────────────────────────────────────────────
const STATE = { all: [], filtered: [], page: 1, perPage: 10 };

// ─── Calorie Calculator (Harris-Benedict) ────────────────────────────────────
function calcCalories(item) {
  const { berat, tinggi, usia, jenis_kelamin, aktivitas, tujuan } = item;
  if (!berat || !tinggi || !usia) return { perHari: null, perMakan: null };

  // BMR
  let bmr;
  if (jenis_kelamin === "pria") {
    bmr = 88.362 + (13.397 * berat) + (4.799 * tinggi) - (5.677 * usia);
  } else {
    bmr = 447.593 + (9.247 * berat) + (3.098 * tinggi) - (4.330 * usia);
  }

  // Activity multiplier
  const multiplier = {
    ringan: 1.375, sedang: 1.55, berat: 1.725,
    aktif: 1.725, sedentary: 1.2, sangat_aktif: 1.9,
  }[aktivitas] || 1.55;

  const tdee = bmr * multiplier;

  // Tujuan adjustment (sama dengan hasil-rekomendasi.js)
  let targetCalories;
  if (tujuan === "turun")       targetCalories = tdee * 0.85;
  else if (tujuan === "naik")   targetCalories = tdee * 1.15;
  else                          targetCalories = tdee;

  const perHari  = Math.round(targetCalories);
  const perMakan = Math.round(targetCalories / 4); // dibagi 4 sesi makan
  return { perHari, perMakan };
}

// ─── Entry point ────────────────────────────────────────────────────────────
export async function renderArsip(root) {
  const user = getUserData();

  if (!user || user.role !== "ahli_gizi") {
    window.location.href = "/login";
    return;
  }

  root.innerHTML = `
    <div class="arsip-wrapper">
      ${renderPetugasSidebar("arsip")}

      <main class="arsip-main">
        <!-- Topbar -->
        <div class="arsip-topbar">
          <div class="arsip-topbar-left">
            <div class="arsip-topbar-title">
              <h1>🗂️ Arsip Konsultasi</h1>
              <p>Riwayat laporan hasil konsultasi user yang telah selesai atau ditolak</p>
            </div>
          </div>
          <div class="arsip-topbar-user">
            <div class="arsip-user-avatar">${user.nama?.charAt(0).toUpperCase()}</div>
            <div>
              <p class="arsip-user-name">${user.nama}</p>
              <p class="arsip-user-role">Petugas Gizi</p>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="arsip-content">

          <!-- Stat Cards -->
          <div class="arsip-stats">
            <div class="arsip-stat-card green">
              <div class="arsip-stat-icon">✅</div>
              <div class="arsip-stat-info">
                <h4>Total Selesai</h4>
                <p class="arsip-stat-value" id="statSelesai">—</p>
              </div>
            </div>
          </div>

          <!-- Table Section -->
          <div class="arsip-table-section">
            <div class="arsip-table-header">
              <h2>📋 Daftar Arsip Konsultasi</h2>
              <div class="arsip-table-controls">
                <input
                  type="text"
                  id="arsipSearch"
                  class="arsip-search-input"
                  placeholder="🔍 Cari nama / email..."
                />
              </div>
            </div>

            <div class="arsip-table-responsive">
              <table class="arsip-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama User</th>
                    <th>Email</th>
                    <th>Usia</th>
                    <th>Kalori/Hari</th>
                    <th>Kalori/Makan</th>
                    <th>Tujuan</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                    <th style="text-align:center">Aksi</th>
                  </tr>
                </thead>
                <tbody id="arsipTableBody">
                  <tr>
                    <td colspan="9">
                      <div class="arsip-empty-state"><p>⏳ Memuat data arsip...</p></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="arsip-pagination" id="arsipPagination" style="display:none;"></div>
          </div>

        </div>
      </main>
    </div>

    <!-- Modal Detail -->
    <div class="arsip-modal-overlay" id="arsipModal">
      <div class="arsip-modal-box">
        <div class="arsip-modal-head">
          <h2>📄 Detail Konsultasi</h2>
          <button class="arsip-modal-close" id="arsipModalClose">✕</button>
        </div>
        <div class="arsip-modal-body" id="arsipModalBody"></div>
      </div>
    </div>
  `;

  setupPetugasSidebarLogout();
  setupArsipEvents();
  await loadArsipData();
}

// ─── Events ─────────────────────────────────────────────────────────────────
function setupArsipEvents() {
  const modal = document.getElementById("arsipModal");
  const closeBtn = document.getElementById("arsipModalClose");

  closeBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.getElementById("arsipSearch")?.addEventListener("input", applyFilter);
  document.getElementById("arsipFilter")?.addEventListener("change", applyFilter);
}

function closeModal() {
  document.getElementById("arsipModal")?.classList.remove("active");
}

// ─── Load Data ───────────────────────────────────────────────────────────────
async function loadArsipData() {
  try {
    // Ambil konsultasi selesai
    const selesai = await getKonsultasiList("selesai");

    STATE.all = selesai.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    updateStats(selesai.length);
    applyFilter();
  } catch (err) {
    console.error("Error loading arsip:", err);
    renderTableRows([]);
    Swal.fire("Error", "Gagal memuat data arsip. Silakan coba lagi.", "error");
  }
}

// ─── Stats ────────────────────────────────────────────────────────────────
function updateStats(selesai) {
  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setEl("statSelesai", selesai);
}

// ─── Filter + Render ─────────────────────────────────────────────────────────
function applyFilter() {
  const query = (document.getElementById("arsipSearch")?.value || "").toLowerCase();
  const status = document.getElementById("arsipFilter")?.value || "all";

  STATE.filtered = STATE.all.filter((item) => {
    const matchSearch =
      !query ||
      (item.nama || "").toLowerCase().includes(query) ||
      (item.email || "").toLowerCase().includes(query);
    const matchStatus = status === "all" || item.status === status;
    return matchSearch && matchStatus;
  });

  STATE.page = 1;
  renderPage();
}

function renderPage() {
  const { filtered, page, perPage } = STATE;
  const start = (page - 1) * perPage;
  const pageData = filtered.slice(start, start + perPage);

  renderTableRows(pageData, start);
  renderPagination(filtered.length);
}

// ─── Table Rows ───────────────────────────────────────────────────────────────
function renderTableRows(rows, offset = 0) {
  const tbody = document.getElementById("arsipTableBody");
  if (!tbody) return;

  if (!rows || rows.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="11">
          <div class="arsip-empty-state"><p>📭 Belum ada data arsip.</p></div>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = rows
    .map((item, idx) => {
      const no = offset + idx + 1;
      const { perHari, perMakan } = calcCalories(item);

      const tanggal = new Date(item.created_at).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const statusBadge = {
        selesai: `<span class="arsip-badge arsip-badge-selesai">✅ Selesai</span>`,
        ditolak: `<span class="arsip-badge arsip-badge-ditolak">❌ Ditolak</span>`,
        diproses: `<span class="arsip-badge arsip-badge-diproses">🔄 Diproses</span>`,
        pending: `<span class="arsip-badge arsip-badge-pending">⏳ Pending</span>`,
      };

      const tujuanLabel = {
        turun: "Turun BB",
        naik: "Naik BB",
        seimbang: "Seimbang",
      };

      return `
        <tr>
          <td>${no}</td>
          <td><strong>${item.nama || "—"}</strong></td>
          <td>${item.email || "—"}</td>
          <td>${item.usia ? item.usia + " thn" : "—"}</td>
          <td>${perHari ? `<strong>${perHari.toLocaleString("id-ID")}</strong> kkal` : "—"}</td>
          <td>${perMakan ? `${perMakan.toLocaleString("id-ID")} kkal` : "—"}</td>
          <td>
            <span class="arsip-badge arsip-badge-${item.tujuan}">
              ${tujuanLabel[item.tujuan] || item.tujuan || "—"}
            </span>
          </td>
          <td>${statusBadge[item.status] || `<span class="arsip-badge">${item.status}</span>`}</td>
          <td>${tanggal}</td>
          <td>
            <div class="arsip-actions">
              <button class="arsip-btn arsip-btn-lihat" onclick="window.arsipLihat(${item.id})">👁 Lihat</button>
              <button class="arsip-btn arsip-btn-hapus" onclick="window.arsipHapus(${item.id})">🗑 Hapus</button>
            </div>
          </td>
        </tr>`;
    })
    .join("");
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function renderPagination(total) {
  const pag = document.getElementById("arsipPagination");
  if (!pag) return;

  const totalPages = Math.ceil(total / STATE.perPage);

  if (totalPages <= 1) {
    pag.style.display = "none";
    return;
  }

  pag.style.display = "flex";

  const from = (STATE.page - 1) * STATE.perPage + 1;
  const to = Math.min(STATE.page * STATE.perPage, total);

  let pageButtons = "";
  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);
  let startPage = Math.max(1, STATE.page - half);
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageButtons += `<button class="arsip-pagination-btn${i === STATE.page ? " active" : ""}" onclick="window.arsipGoPage(${i})">${i}</button>`;
  }

  pag.innerHTML = `
    <span>Menampilkan ${from}–${to} dari ${total} data</span>
    <div class="arsip-pagination-btns">
      <button class="arsip-pagination-btn" onclick="window.arsipGoPage(${STATE.page - 1})" ${STATE.page === 1 ? "disabled" : ""}>‹ Prev</button>
      ${pageButtons}
      <button class="arsip-pagination-btn" onclick="window.arsipGoPage(${STATE.page + 1})" ${STATE.page === totalPages ? "disabled" : ""}>Next ›</button>
    </div>`;
}

// ─── Global Handlers ──────────────────────────────────────────────────────────
window.arsipGoPage = function (page) {
  const totalPages = Math.ceil(STATE.filtered.length / STATE.perPage);
  if (page < 1 || page > totalPages) return;
  STATE.page = page;
  renderPage();
};

window.arsipLihat = async function (id) {
  const modal = document.getElementById("arsipModal");
  const body = document.getElementById("arsipModalBody");
  if (!modal || !body) return;

  body.innerHTML = `<div class="arsip-empty-state"><p>⏳ Memuat detail...</p></div>`;
  modal.classList.add("active");

  try {
    const data = await getKonsultasiDetail(id);

    const tanggal = new Date(data.created_at).toLocaleString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const updatedAt = data.updated_at
      ? new Date(data.updated_at).toLocaleString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

    const statusLabel = {
      selesai: "✅ Selesai",
      ditolak: "❌ Ditolak",
      diproses: "🔄 Diproses",
      pending: "⏳ Pending",
    };

    const tujuanLabel = {
      turun: "Turun Berat Badan",
      naik: "Naik Berat Badan",
      seimbang: "Berat Badan Seimbang",
    };

    const aktivitasLabel = {
      sedentary: "Tidak Aktif (Sedentary)",
      ringan: "Ringan",
      sedang: "Sedang",
      aktif: "Aktif",
      sangat_aktif: "Sangat Aktif",
    };

    const { perHari, perMakan } = calcCalories(data);

    body.innerHTML = `
      <div class="arsip-detail-grid">
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Nama</div>
          <div class="arsip-detail-value">${data.nama || "—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Email</div>
          <div class="arsip-detail-value">${data.email || "—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Usia</div>
          <div class="arsip-detail-value">${data.usia ? data.usia + " tahun" : "—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Jenis Kelamin</div>
          <div class="arsip-detail-value">${data.jenis_kelamin || "—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Berat Badan</div>
          <div class="arsip-detail-value">${data.berat ? data.berat + " kg" : "—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Tinggi Badan</div>
          <div class="arsip-detail-value">${data.tinggi ? data.tinggi + " cm" : "—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Aktivitas</div>
          <div class="arsip-detail-value">${aktivitasLabel[data.aktivitas] || data.aktivitas || "—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Target Kalori/Hari</div>
          <div class="arsip-detail-value">${perHari ? `<strong>${perHari.toLocaleString("id-ID")}</strong> kkal` : "—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Target Kalori/Makan (÷3)</div>
          <div class="arsip-detail-value">${perMakan ? `${perMakan.toLocaleString("id-ID")} kkal` : "—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Tujuan</div>
          <div class="arsip-detail-value">${tujuanLabel[data.tujuan] || data.tujuan || "—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Status</div>
          <div class="arsip-detail-value">${statusLabel[data.status] || data.status || "—"}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Dibuat</div>
          <div class="arsip-detail-value">${tanggal}</div>
        </div>
        <div class="arsip-detail-item">
          <div class="arsip-detail-label">Diperbarui</div>
          <div class="arsip-detail-value">${updatedAt}</div>
        </div>
        ${
          data.catatan
            ? `<div class="arsip-detail-item full-width">
                <div class="arsip-detail-label">Catatan User</div>
                <div class="arsip-detail-value">${data.catatan}</div>
              </div>`
            : ""
        }
        ${
          data.respons
            ? `<div class="arsip-detail-item full-width">
                <div class="arsip-detail-label">Respons Petugas</div>
                <div class="arsip-detail-value">${data.respons}</div>
              </div>`
            : ""
        }
      </div>`;
  } catch (err) {
    console.error("Error loading detail:", err);
    body.innerHTML = `<div class="arsip-empty-state"><p>❌ Gagal memuat detail konsultasi.</p></div>`;
  }
};

window.arsipHapus = async function (id) {
  const confirmed = await Swal.fire({
    title: "Hapus Arsip?",
    text: "Data konsultasi ini akan dihapus secara permanen dan tidak dapat dikembalikan.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e53e3e",
    cancelButtonColor: "#718096",
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Batal",
  });

  if (!confirmed.isConfirmed) return;

  try {
    await deleteKonsultasi(id);

    STATE.all = STATE.all.filter((item) => item.id !== id);
    applyFilter();

    // Update stat cards
    const selesai = STATE.all.filter((i) => i.status === "selesai").length;
    updateStats(selesai);

    Swal.fire({
      title: "Terhapus!",
      text: "Data konsultasi berhasil dihapus.",
      icon: "success",
      timer: 1800,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error("Error deleting konsultasi:", err);
    Swal.fire("Gagal", err.message || "Tidak dapat menghapus data.", "error");
  }
};
