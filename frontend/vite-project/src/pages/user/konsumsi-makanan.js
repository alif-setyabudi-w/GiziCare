import "../../styles/user-css/konsumsi-makanan.css";
import { getUserData, addKonsumsi, getKonsumsiByUser, updateKonsumsi, deleteKonsumsiItem } from "../../api/backend.js";
import { escapeHTML } from "../../utils/escapeHTML.js";
import { renderUserSidebar, setupUserSidebarLogout } from "../../components/sidebar-user.js";
import Swal from "sweetalert2";

export function renderUserKonsumsiMakanan(root) {
  const user = getUserData();
  if (!user || user.role !== "pasien") {
    window.location.href = "/login";
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  root.innerHTML = `
    <div class="konsumsi-wrapper">
      <div class="konsumsi-container">
        ${renderUserSidebar("konsumsi-makanan")}

        <main class="konsumsi-main-content">
          <div class="konsumsi-topbar">
            <div class="konsumsi-topbar-title">
              <h1>🍽️ Catatan Konsumsi Harian</h1>
              <p>Catat makanan dan minuman yang Anda konsumsi setiap hari</p>
            </div>
            <div class="konsumsi-topbar-user">
              <div class="konsumsi-user-info">
                <p class="konsumsi-user-name">${escapeHTML(user.nama)}</p>
                <p class="konsumsi-user-role">Pasien</p>
              </div>
            </div>
          </div>

          <div class="konsumsi-content">
            <!-- FORM TAMBAH KONSUMSI -->
            <div class="konsumsi-form-card">
              <div class="konsumsi-form-card-header">
                <h2>➕ Tambah Konsumsi Makanan/Minuman</h2>
                <p>Isi informasi di bawah ini lalu klik Simpan</p>
              </div>
              <div class="konsumsi-form-body">
                <form id="formKonsumsi">
                  <div class="konsumsi-form-row three-col">
                    <div class="konsumsi-form-group">
                      <label class="konsumsi-label">Tanggal</label>
                      <input type="date" id="fTanggal" class="konsumsi-input" value="${today}" max="${today}" required />
                    </div>
                    <div class="konsumsi-form-group">
                      <label class="konsumsi-label">Waktu Makan</label>
                      <select id="fWaktu" class="konsumsi-select" required>
                        <option value="">-- Pilih Waktu --</option>
                        <option value="pagi">🌅 Pagi</option>
                        <option value="siang">☀️ Siang</option>
                        <option value="sore">🌤️ Sore</option>
                        <option value="malam">🌙 Malam</option>
                        <option value="minuman">💧 Minuman</option>
                      </select>
                    </div>
                    <div class="konsumsi-form-group">
                      <label class="konsumsi-label">Porsi (opsional)</label>
                      <input type="text" id="fPorsi" class="konsumsi-input" placeholder="cth: 1 piring, 200ml" />
                    </div>
                  </div>
                  <div class="konsumsi-form-row">
                    <div class="konsumsi-form-group full-width">
                      <label class="konsumsi-label">Nama Makanan / Minuman <span style="color:#e53e3e">*</span></label>
                      <input type="text" id="fNama" class="konsumsi-input" placeholder="cth: Nasi putih, Ayam goreng, Air putih, Teh manis..." required />
                    </div>
                  </div>
                  <div class="konsumsi-form-row">
                    <div class="konsumsi-form-group full-width">
                      <label class="konsumsi-label">Catatan (opsional)</label>
                      <textarea id="fCatatan" class="konsumsi-textarea" placeholder="Tambahkan catatan jika ada, misalnya: dimasak sendiri, beli di warung, dsb..."></textarea>
                    </div>
                  </div>
                  <div class="konsumsi-form-actions">
                    <button type="button" class="btn-cancel" id="btnReset">Reset</button>
                    <button type="submit" class="btn-save" id="btnSimpan">💾 Simpan</button>
                  </div>
                </form>
              </div>
            </div>

            <!-- TABEL RIWAYAT KONSUMSI -->
            <div class="konsumsi-table-card">
              <div class="konsumsi-table-header">
                <h2>📋 Riwayat Konsumsi Saya</h2>
                <div class="konsumsi-table-filters">
                  <input type="date" id="filterTanggal" class="konsumsi-filter-input" placeholder="Filter tanggal" max="${today}" />
                  <select id="filterWaktu" class="konsumsi-filter-select">
                    <option value="">Semua Waktu</option>
                    <option value="pagi">Pagi</option>
                    <option value="siang">Siang</option>
                    <option value="sore">Sore</option>
                    <option value="malam">Malam</option>
                    <option value="minuman">Minuman</option>
                  </select>
                </div>
              </div>
              <div class="konsumsi-table-responsive">
                <table class="konsumsi-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Tanggal</th>
                      <th>Waktu</th>
                      <th>Nama Makanan / Minuman</th>
                      <th>Porsi</th>
                      <th>Catatan</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody id="tabelKonsumsi">
                    <tr class="empty-row"><td colspan="7">Memuat data...</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- MODAL EDIT -->
    <div class="konsumsi-modal-overlay" id="modalEdit" style="display:none;">
      <div class="konsumsi-modal">
        <div class="konsumsi-modal-header">
          <h3>✏️ Edit Konsumsi</h3>
          <button class="btn-modal-close" id="btnModalClose">✕</button>
        </div>
        <div class="konsumsi-modal-body">
          <input type="hidden" id="editId" />
          <div class="konsumsi-form-row">
            <div class="konsumsi-form-group">
              <label class="konsumsi-label">Tanggal</label>
              <input type="date" id="editTanggal" class="konsumsi-input" max="${today}" />
            </div>
          </div>
          <div class="konsumsi-form-row">
            <div class="konsumsi-form-group">
              <label class="konsumsi-label">Waktu Makan</label>
              <select id="editWaktu" class="konsumsi-select">
                <option value="pagi">🌅 Pagi</option>
                <option value="siang">☀️ Siang</option>
                <option value="sore">🌤️ Sore</option>
                <option value="malam">🌙 Malam</option>
                <option value="minuman">💧 Minuman</option>
              </select>
            </div>
          </div>
          <div class="konsumsi-form-row">
            <div class="konsumsi-form-group">
              <label class="konsumsi-label">Nama Makanan / Minuman</label>
              <input type="text" id="editNama" class="konsumsi-input" />
            </div>
          </div>
          <div class="konsumsi-form-row">
            <div class="konsumsi-form-group">
              <label class="konsumsi-label">Porsi</label>
              <input type="text" id="editPorsi" class="konsumsi-input" placeholder="cth: 1 piring, 200ml" />
            </div>
          </div>
          <div class="konsumsi-form-row">
            <div class="konsumsi-form-group">
              <label class="konsumsi-label">Catatan</label>
              <textarea id="editCatatan" class="konsumsi-textarea"></textarea>
            </div>
          </div>
        </div>
        <div class="konsumsi-modal-footer">
          <button class="btn-cancel" id="btnEditCancel">Batal</button>
          <button class="btn-save" id="btnEditSave">💾 Simpan Perubahan</button>
        </div>
      </div>
    </div>
  `;

  setupUserSidebarLogout();

  let allData = [];

  // ===== LOAD DATA =====
  async function loadData(tanggal = null) {
    try {
      const res = await getKonsumsiByUser(user.id, tanggal);
      allData = res.data || [];
      renderTable(allData);
    } catch {
      renderTable([]);
    }
  }

  function formatTanggal(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  }

  function waktuLabel(w) {
    const map = { pagi: "🌅 Pagi", siang: "☀️ Siang", sore: "🌤️ Sore", malam: "🌙 Malam", minuman: "💧 Minuman" };
    return map[w] || w;
  }

  function renderTable(data) {
    const tbody = document.getElementById("tabelKonsumsi");
    if (!data.length) {
      tbody.innerHTML = `<tr class="empty-row"><td colspan="7">Belum ada data konsumsi. Tambahkan makanan/minuman yang Anda konsumsi.</td></tr>`;
      return;
    }
    tbody.innerHTML = data.map((row, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${formatTanggal(row.tanggal)}</td>
        <td><span class="waktu-badge waktu-${row.waktu_makan}">${waktuLabel(row.waktu_makan)}</span></td>
        <td><strong>${escapeHTML(row.nama_makanan)}</strong></td>
        <td>${escapeHTML(row.porsi || "-")}</td>
        <td>${escapeHTML(row.catatan || "-")}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon edit" title="Edit" onclick="openEdit(${row.id})">✏️</button>
            <button class="btn-icon delete" title="Hapus" onclick="hapusKonsumsi(${row.id})">🗑️</button>
          </div>
        </td>
      </tr>
    `).join("");
  }

  // ===== FILTER =====
  document.getElementById("filterTanggal").addEventListener("change", applyFilter);
  document.getElementById("filterWaktu").addEventListener("change", applyFilter);

  function applyFilter() {
    const tgl = document.getElementById("filterTanggal").value;
    const waktu = document.getElementById("filterWaktu").value;

    // Reload dari server saat filter tanggal berubah
    loadData(tgl || null).then(() => {
      if (waktu) {
        const filtered = allData.filter(r => r.waktu_makan === waktu);
        renderTable(filtered);
      }
    });
  }

  // ===== FORM SUBMIT =====
  document.getElementById("formKonsumsi").addEventListener("submit", async (e) => {
    e.preventDefault();
    const tanggal = document.getElementById("fTanggal").value;
    const waktu_makan = document.getElementById("fWaktu").value;
    const nama_makanan = document.getElementById("fNama").value.trim();
    const porsi = document.getElementById("fPorsi").value.trim();
    const catatan = document.getElementById("fCatatan").value.trim();

    if (!tanggal || !waktu_makan || !nama_makanan) {
      Swal.fire("Perhatian", "Tanggal, waktu makan, dan nama makanan wajib diisi.", "warning");
      return;
    }

    const btn = document.getElementById("btnSimpan");
    btn.disabled = true;
    btn.textContent = "Menyimpan...";

    try {
      await addKonsumsi({ user_id: user.id, tanggal, waktu_makan, nama_makanan, porsi: porsi || null, catatan: catatan || null });
      Swal.fire({ icon: "success", title: "Berhasil!", text: "Data konsumsi berhasil disimpan.", timer: 1500, showConfirmButton: false });
      document.getElementById("formKonsumsi").reset();
      document.getElementById("fTanggal").value = today;
      await loadData();
    } catch (err) {
      Swal.fire("Gagal", err.message || "Terjadi kesalahan saat menyimpan.", "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "💾 Simpan";
    }
  });

  // ===== RESET =====
  document.getElementById("btnReset").addEventListener("click", () => {
    document.getElementById("formKonsumsi").reset();
    document.getElementById("fTanggal").value = today;
  });

  // ===== OPEN EDIT MODAL =====
  window.openEdit = (id) => {
    const row = allData.find(r => r.id === id);
    if (!row) return;
    document.getElementById("editId").value = id;
    document.getElementById("editTanggal").value = row.tanggal?.split("T")[0] || "";
    document.getElementById("editWaktu").value = row.waktu_makan;
    document.getElementById("editNama").value = row.nama_makanan;
    document.getElementById("editPorsi").value = row.porsi || "";
    document.getElementById("editCatatan").value = row.catatan || "";
    document.getElementById("modalEdit").style.display = "flex";
  };

  document.getElementById("btnModalClose").addEventListener("click", closeModal);
  document.getElementById("btnEditCancel").addEventListener("click", closeModal);
  function closeModal() { document.getElementById("modalEdit").style.display = "none"; }

  // Close modal on overlay click
  document.getElementById("modalEdit").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modalEdit")) closeModal();
  });

  // ===== SAVE EDIT =====
  document.getElementById("btnEditSave").addEventListener("click", async () => {
    const id = document.getElementById("editId").value;
    const tanggal = document.getElementById("editTanggal").value;
    const waktu_makan = document.getElementById("editWaktu").value;
    const nama_makanan = document.getElementById("editNama").value.trim();
    const porsi = document.getElementById("editPorsi").value.trim();
    const catatan = document.getElementById("editCatatan").value.trim();

    if (!tanggal || !waktu_makan || !nama_makanan) {
      Swal.fire("Perhatian", "Semua field wajib diisi.", "warning");
      return;
    }

    try {
      await updateKonsumsi(id, { user_id: user.id, tanggal, waktu_makan, nama_makanan, porsi: porsi || null, catatan: catatan || null });
      closeModal();
      Swal.fire({ icon: "success", title: "Berhasil!", text: "Data berhasil diperbarui.", timer: 1500, showConfirmButton: false });
      await loadData(document.getElementById("filterTanggal").value || null);
    } catch (err) {
      Swal.fire("Gagal", err.message || "Terjadi kesalahan.", "error");
    }
  });

  // ===== HAPUS =====
  window.hapusKonsumsi = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Data?",
      text: "Data konsumsi ini akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonText: "Batal",
      confirmButtonText: "Ya, Hapus",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteKonsumsiItem(id);
      Swal.fire({ icon: "success", title: "Terhapus!", text: "Data berhasil dihapus.", timer: 1500, showConfirmButton: false });
      await loadData(document.getElementById("filterTanggal").value || null);
    } catch (err) {
      Swal.fire("Gagal", err.message || "Terjadi kesalahan.", "error");
    }
  };

  loadData();
}