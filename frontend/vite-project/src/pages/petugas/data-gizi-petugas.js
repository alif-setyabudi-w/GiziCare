import "../../styles/petugas-css/data-gizi.css";
import { getUserData, getNutritionData, searchNutritionData } from "../../api/backend.js";
// PERBAIKAN: Import renderPetugasSidebar dan setupPetugasSidebarLogout
import { renderPetugasSidebar, setupPetugasSidebarLogout } from "../../components/sidebar-petugas.js";

export function renderPetugasDataGizi(root) { // Ganti nama fungsi agar konsisten
  const user = getUserData();

  // Cek Role: Harus 'ahli_gizi'
  if (!user || user.role !== "ahli_gizi") {
    window.location.href = "/login";
    return;
  }

  root.innerHTML = `
    <div class="data-gizi-wrapper">
      <div class="data-gizi-container">
        ${renderPetugasSidebar("data-gizi")}

        <main class="data-gizi-main-content">
          <div class="data-gizi-topbar">
            <div class="data-gizi-topbar-left">
              <div class="data-gizi-topbar-title">
                <h1>Data Gizi</h1>
                <p>Kelola data nutrisi makanan</p>
              </div>
            </div>
            <div class="data-gizi-topbar-user">
              <div class="data-gizi-user-avatar">
                ${user.nama?.charAt(0).toUpperCase()}
              </div>
              <div class="data-gizi-user-info">
                <p class="data-gizi-user-name">${user.nama}</p>
                <p class="data-gizi-user-role">Petugas Gizi</p>
              </div>
            </div>
          </div>

          <div class="data-gizi-dashboard-content">
            <div class="data-gizi-table-section">
              <div class="data-gizi-filters">
                <input type="text" placeholder="Cari nama makanan... (cth: beras, daging, sayur)" class="data-gizi-filter-input" id="nutritionSearch">
              </div>

              <div class="data-gizi-table-responsive">
                <table class="data-gizi-table">
                  <thead>
                    <tr>
                      <th style="width: 1%;">Kode</th>
                      <th style="width: 3%;">Nama Pangan</th>
                      <th style="width: 1%;">Energi (kal)</th>
                      <th style="width: 1%;">Protein (g)</th>
                      <th style="width: 1%;">Lemak (g)</th>
                      <th style="width: 1%;">Karbohidrat (g)</th>
                    </tr>
                  </thead>
                  <tbody id="nutritionTable">
                    <tr>
                      <td colspan="6" style="text-align: center; padding: 2rem; color: #a0aec0;">
                        <div class="data-gizi-loading">Memuat data gizi...</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="data-gizi-table-section">
              <h2>Statistik Data Gizi</h2>
              <div class="data-gizi-stats-grid">
                <div class="data-gizi-stat-card">
                  <div class="data-gizi-stat-header">
                    <div>
                      <h3>Total Data Gizi</h3>
                      <div class="data-gizi-stat-value" id="totalNutrition">0</div>
                    </div>
                    <div class="data-gizi-stat-icon">📊</div>
                  </div>
                  <div class="data-gizi-stat-trend">Item nutrisi terdaftar</div>
                </div>

                <div class="data-gizi-stat-card">
                  <div class="data-gizi-stat-header">
                    <div>
                      <h3>Rata-rata Protein</h3>
                      <div class="data-gizi-stat-value" id="vegetableCount">0</div>
                    </div>
                    <div class="data-gizi-stat-icon">🥩</div>
                  </div>
                  <div class="data-gizi-stat-trend">Protein per item (g)</div>
                </div>

                <div class="data-gizi-stat-card">
                  <div class="data-gizi-stat-header">
                    <div>
                      <h3>Rata-rata Energi</h3>
                      <div class="data-gizi-stat-value" id="fruitCount">0</div>
                    </div>
                    <div class="data-gizi-stat-icon">⚡</div>
                  </div>
                  <div class="data-gizi-stat-trend">Energi per item (kal)</div>
                </div>

                <div class="data-gizi-stat-card">
                  <div class="data-gizi-stat-header">
                    <div>
                      <h3>Rata-rata Lemak</h3>
                      <div class="data-gizi-stat-value" id="proteinCount">0</div>
                    </div>
                    <div class="data-gizi-stat-icon">🥑</div>
                  </div>
                  <div class="data-gizi-stat-trend">Lemak per item (g)</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `;

  setupDataGiziEvents();
}

function setupDataGiziEvents() {
  const searchInput = document.getElementById("nutritionSearch");

  // Setup sidebar logout yang benar
  setupPetugasSidebarLogout();

  if(searchInput) searchInput.addEventListener("input", handleNutritionSearch);

  loadNutritionData();
}

// ... Sisa fungsi helper (loadNutritionData, handleNutritionSearch, dll) biarkan sama ...
async function loadNutritionData() {
  try {
    const response = await getNutritionData();
    if (response.success && response.data) {
      renderNutritionTable(response.data);
      updateNutritionStats(response.data);
      window.allNutritionData = response.data;
    }
  } catch (error) {
    console.error('Error loading nutrition data:', error);
    const tableBody = document.getElementById("nutritionTable");
    if(tableBody) {
        tableBody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align: center; padding: 2rem; color: #e53e3e;">
            Error loading nutrition data. Please try again later.
            </td>
        </tr>
        `;
    }
  }
}

async function handleNutritionSearch(event) {
  const searchQuery = event.target.value.trim();
  
  if (searchQuery === "") {
    // Tampilkan semua data jika search kosong
    if (window.allNutritionData) {
      renderNutritionTable(window.allNutritionData);
      updateNutritionStats(window.allNutritionData);
    }
    return;
  }

  try {
    const response = await searchNutritionData(searchQuery);
    if (response.success && response.data) {
      renderNutritionTable(response.data);
      updateNutritionStats(response.data);
    } else {
      const tableBody = document.getElementById("nutritionTable");
      if(tableBody) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 2rem; color: #a0aec0;">
              Tidak ada hasil pencarian untuk "${searchQuery}"
            </td>
          </tr>
        `;
      }
    }
  } catch (error) {
    console.error('Error searching nutrition data:', error);
  }
}

function renderNutritionTable(nutritionList) {
  const tableBody = document.getElementById("nutritionTable");
  if(!tableBody) return;
  tableBody.innerHTML = "";

  if (!nutritionList || nutritionList.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: #a0aec0;">
          Tidak ada data nutrisi yang ditemukan
        </td>
      </tr>
    `;
    return;
  }

  nutritionList.forEach((nutrition) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><span class="kode-badge">${nutrition.kode || "N/A"}</span></td>
      <td>${nutrition.nama_bahan || "N/A"}</td>
      <td>${nutrition.energi_kal || 0}</td>
      <td>${nutrition.protein_g || 0}</td>
      <td>${nutrition.lemak_g || 0}</td>
      <td>${nutrition.karbohidrat_g || 0}</td>
    `;
    tableBody.appendChild(row);
  });
}

function filterNutrition() {
  // Fungsi helper untuk menampilkan semua data
  if (!window.allNutritionData) return;
  renderNutritionTable(window.allNutritionData);
  updateNutritionStats(window.allNutritionData);
}

function updateNutritionStats(nutritionList) {
  const totalNutrition = nutritionList.length;
  let avgProtein = 0, avgEnergy = 0, avgFat = 0, avgCarbs = 0;

  if (totalNutrition > 0) {
    avgProtein = nutritionList.reduce((sum, n) => sum + (n.protein_g || 0), 0) / totalNutrition;
    avgEnergy = nutritionList.reduce((sum, n) => sum + (n.energi_kal || 0), 0) / totalNutrition;
    avgFat = nutritionList.reduce((sum, n) => sum + (n.lemak_g || 0), 0) / totalNutrition;
    avgCarbs = nutritionList.reduce((sum, n) => sum + (n.karbohidrat_g || 0), 0) / totalNutrition;
  }

  const elTotal = document.getElementById("totalNutrition");
  const elProt = document.getElementById("vegetableCount");
  const elEnergy = document.getElementById("fruitCount");
  const elFat = document.getElementById("proteinCount");

  if(elTotal) elTotal.textContent = totalNutrition;
  if(elProt) elProt.textContent = avgProtein.toFixed(2);
  if(elEnergy) elEnergy.textContent = avgEnergy.toFixed(0);
  if(elFat) elFat.textContent = avgFat.toFixed(2);
}