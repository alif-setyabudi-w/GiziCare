import '../../styles/user-css/hasil-rekomendasi.css';
import { getUserData, getUserRekomendasiList, getUserRekomendasiDetail } from "../../api/backend.js";
import { escapeHTML } from "../../utils/escapeHTML.js";
import { renderUserSidebar, setupUserSidebarLogout } from "../../components/sidebar-user.js";

export async function renderUserHasilRekomendasi(root) {
    const user = getUserData();

    // ===============================
    // 1. Validasi Login & Role
    // ===============================
    if (!user || user.role !== "pasien") {
        window.location.href = "/login";
        return;
    }

    // ===============================
    // 2. Setup Layout (Sidebar + Content)
    // ===============================
    root.innerHTML = `
        <div class="user-wrapper">
            <div class="user-container">
                ${renderUserSidebar('hasil-rekomendasi')}
                <main class="user-main-content" id="mainContentArea"></main>
            </div>
        </div>

        <!-- Modal Detail Rekomendasi -->
        <div class="hasil-modal" id="detailModal">
            <div class="hasil-modal-content">
                <button class="hasil-modal-close" id="closeModal">X</button>
                <div class="hasil-modal-body" id="modalBody">
                    <!-- Detail akan di-load di sini -->
                </div>
            </div>
        </div>
    `;

    setupUserSidebarLogout();

    const contentArea = document.getElementById('mainContentArea');

    try {
        // ===============================
        // 3. Render Halaman
        // ===============================
        contentArea.innerHTML = `
            <div class="hasil-rekomendasi-container">
                <div class="hasil-header">
                    <div class="header-content">
                        <h1>📊 Hasil Rekomendasi Gizi</h1>
                        <p class="subtitle">
                            Halo <b>${escapeHTML(user.nama)}</b>, berikut adalah daftar rekomendasi gizi Anda.
                        </p>
                    </div>
                </div>

                <!-- Overview Cards -->
                <div class="hasil-overview-cards">
                    <div class="hasil-overview-card">
                        <div class="hasil-card-icon">📋</div>
                        <div class="hasil-card-content">
                            <h3>Total Rekomendasi</h3>
                            <p class="hasil-card-value" id="totalRekomendasi">0</p>
                        </div>
                    </div>
                </div>

                <!-- Tabel Rekomendasi -->
                <div class="hasil-table-section">
                    <h2>Daftar Rekomendasi Gizi</h2>
                    
                    <div class="hasil-table-responsive">
                        <table class="hasil-table">
                            <thead>
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Tujuan</th>
                                    <th>BMI</th>
                                    <th>Target Kalori</th>
                                    <th>Jumlah Makanan</th>
                                    <th style="text-align:center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="rekomendasiTable">
                                <tr>
                                    <td colspan="6" style="text-align: center; padding: 2rem;">
                                        <div class="hasil-loading">Memuat rekomendasi...</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // ===============================
        // 4. Setup Event Listeners
        // ===============================
        setupRekomendasiEvents();

        // ===============================
        // 5. Load Data
        // ===============================
        loadRekomendasiData();

    } catch (error) {
        console.error('Error loading hasil rekomendasi:', error);
        contentArea.innerHTML = `
            <div class="hasil-rekomendasi-container">
                <div class="error-message" style="text-align:center; margin-top:50px;">
                    <h2>⚠️ Data Belum Tersedia</h2>
                    <p>${error.message}</p>
                    <button class="btn-kembali" id="btnToDashboard"
                        style="padding:10px 20px; background:#10b981; color:white; border:none; border-radius:5px; cursor:pointer; margin-top:10px;">
                        Ke Dashboard
                    </button>
                </div>
            </div>
        `;

        document.getElementById('btnToDashboard')
            ?.addEventListener('click', () => {
                window.location.href = '/user/dashboard';
            });
    }
}

function setupRekomendasiEvents() {
    const closeModalBtn = document.getElementById("closeModal");
    const modal = document.getElementById("detailModal");

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
}

async function loadRekomendasiData() {
    try {
        const result = await getUserRekomendasiList();
        renderRekomendasiTable(result.data || []);
        updateRekomendasiStats(result.data || []);
    } catch (error) {
        console.error('Error loading rekomendasi:', error);
        const table = document.getElementById("rekomendasiTable");
        if (table) {
            table.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #e53e3e;">
                        Error memuat rekomendasi. Silakan coba lagi nanti.
                    </td>
                </tr>
            `;
        }
    }
}

function renderRekomendasiTable(rekomendasiList) {
    const tableBody = document.getElementById("rekomendasiTable");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (!rekomendasiList || rekomendasiList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: #a0aec0;">
                    Belum ada rekomendasi. Konsultasi dengan petugas gizi terlebih dahulu.
                </td>
            </tr>
        `;
        return;
    }

    rekomendasiList.forEach((rekomendasi) => {
        const row = document.createElement("tr");
        const tanggal = new Date(rekomendasi.created_at).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        const tujuanMap = {
            'turun': 'Turun BB',
            'naik': 'Naik BB',
            'seimbang': 'Seimbang'
        };

        row.innerHTML = `
            <td>${tanggal}</td>
            <td>
                <span class="hasil-badge hasil-badge-${rekomendasi.tujuan}">
                    ${tujuanMap[rekomendasi.tujuan] || rekomendasi.tujuan}
                </span>
            </td>
            <td>${rekomendasi.bmi ? parseFloat(rekomendasi.bmi).toFixed(1) : "N/A"}</td>
            <td>${Math.round(rekomendasi.target_calories || 0)} kkal</td>
            <td><strong>${rekomendasi.total_makanan || 0}</strong> item</td>
            <td id="rekomendasiActions">
                <button class="hasil-btn-detail" onclick="window.showUserRekomendasiDetail(${rekomendasi.id})">
                    Detail
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateRekomendasiStats(rekomendasiList) {
    const total = rekomendasiList.length;
    const elTotal = document.getElementById("totalRekomendasi");
    if (elTotal) elTotal.textContent = total;
}

// Function untuk menampilkan detail rekomendasi
window.showUserRekomendasiDetail = async function(rekomendasiId) {
    try {
        const modal = document.getElementById("detailModal");
        const modalBody = document.getElementById("modalBody");

        // Show loading
        modalBody.innerHTML = `<div class="hasil-modal-loading">Memuat detail rekomendasi...</div>`;
        modal.classList.add("active");

        // Get detail
        const result = await getUserRekomendasiDetail(rekomendasiId);
        const { rekomendasi, detail_makanan } = result;

        // Calculate BMI category
        const bmi = parseFloat(rekomendasi.bmi) || 0;
        let bmiCategory = '';
        if (bmi < 18.5) {
            bmiCategory = 'Kurus';
        } else if (bmi >= 18.5 && bmi < 25) {
            bmiCategory = 'Normal';
        } else if (bmi >= 25 && bmi < 30) {
            bmiCategory = 'Kelebihan Berat';
        } else {
            bmiCategory = 'Obesitas';
        }

        const tujuanMap = {
            'turun': 'Turunkan Berat Badan',
            'naik': 'Naikkan Berat Badan',
            'seimbang': 'Seimbangkan Berat'
        };

        const aktivitasMap = {
            'ringan': 'Ringan',
            'sedang': 'Sedang',
            'berat': 'Berat'
        };

        // Render detail
        let html = `
            <h2>Detail Rekomendasi Gizi</h2>
            
            <div class="hasil-detail-grid">
                <div class="hasil-detail-group">
                    <h3>Profil Pengguna</h3>
                    <div class="hasil-detail-row">
                        <span>Nama</span>
                        <strong>${escapeHTML(rekomendasi.nama_user)}</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>Usia</span>
                        <strong>${escapeHTML(String(rekomendasi.usia))} tahun</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>Berat Badan</span>
                        <strong>${escapeHTML(String(rekomendasi.berat_badan))} kg</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>Tinggi Badan</span>
                        <strong>${escapeHTML(String(rekomendasi.tinggi_badan))} cm</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>BMI</span>
                        <strong>${bmi ? bmi.toFixed(1) : "N/A"} (${escapeHTML(bmiCategory)})</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>Jenis Kelamin</span>
                        <strong>${escapeHTML(rekomendasi.jenis_kelamin === "pria" ? "Pria" : "Wanita")}</strong>
                    </div>
                </div>

                <div class="hasil-detail-group">
                    <h3>Hasil Kalkulasi</h3>
                    <div class="hasil-detail-row">
                        <span>BMR</span>
                        <strong>${Math.round(rekomendasi.bmr)} kkal/hari</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>TDEE</span>
                        <strong>${Math.round(rekomendasi.tdee)} kkal/hari</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>Target Kalori</span>
                        <strong>${Math.round(rekomendasi.target_calories)} kkal/hari</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>Tujuan</span>
                        <strong>${escapeHTML(tujuanMap[rekomendasi.tujuan] || rekomendasi.tujuan)}</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>Tingkat Aktivitas</span>
                        <strong>${escapeHTML(aktivitasMap[rekomendasi.aktivitas] || rekomendasi.aktivitas)}</strong>
                    </div>
                </div>

                <div class="hasil-detail-group">
                    <h3>Target Nutrisi</h3>
                    <div class="hasil-detail-row">
                        <span>Protein</span>
                        <strong>${rekomendasi.target_protein_g ? parseFloat(rekomendasi.target_protein_g).toFixed(1) : "N/A"} g</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>Lemak</span>
                        <strong>${rekomendasi.target_lemak_g ? parseFloat(rekomendasi.target_lemak_g).toFixed(1) : "N/A"} g</strong>
                    </div>
                    <div class="hasil-detail-row">
                        <span>Karbohidrat</span>
                        <strong>${rekomendasi.target_karbohidrat_g ? parseFloat(rekomendasi.target_karbohidrat_g).toFixed(1) : "N/A"} g</strong>
                    </div>
                </div>
            </div>

            ${rekomendasi.catatan_petugas ? `
            <div class="hasil-catatan-petugas">
                <div class="catatan-header">
                    <span class="catatan-icon">📝</span>
                    <h3>Catatan dari Petugas</h3>
                </div>
                <div class="catatan-body">
                    <p>${escapeHTML(rekomendasi.catatan_petugas)}</p>
                </div>
            </div>` : ''}

            <h3 style="margin-top: 2rem;">Rekomendasi Makanan (${detail_makanan.length} item)</h3>
            <div class="hasil-foods-table">
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
                    <td>${escapeHTML(food.nama_makanan)}</td>
                    <td style="text-align:center;">${food.energi_kal ? parseFloat(food.energi_kal).toFixed(0) : "N/A"}</td>
                    <td style="text-align:center;">${food.protein_g ? parseFloat(food.protein_g).toFixed(1) : "N/A"}</td>
                    <td style="text-align:center;">${food.lemak_g ? parseFloat(food.lemak_g).toFixed(1) : "N/A"}</td>
                    <td style="text-align:center;">${food.karbohidrat_g ? parseFloat(food.karbohidrat_g).toFixed(1) : "N/A"}</td>
                    <td>
                        <span class="hasil-similarity-bar">
                            <span class="hasil-similarity-fill" style="width: ${(food.similarity_score * 100)}%"></span>
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
                    Error memuat detail rekomendasi
                </div>
            `;
        }
    }
};

