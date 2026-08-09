import "../../styles/user-css/data-makanan.css";
import { getUserData, getNutritionData, searchNutritionData } from "../../api/backend.js";
import { escapeHTML } from "../../utils/escapeHTML.js";
import { renderUserSidebar, setupUserSidebarLogout } from "../../components/sidebar-user.js";

export function renderUserDataMakanan(root) {
  const user = getUserData();

  // Cek Role: Harus 'pasien'
  if (!user || user.role !== "pasien") {
    window.location.href = "/login";
    return;
  }

  root.innerHTML = `
    <div class="data-makanan-wrapper">
      <div class="data-makanan-container">
        ${renderUserSidebar("data-makanan")}

        <main class="data-makanan-main-content">
          <div class="data-makanan-topbar">
            <div class="data-makanan-topbar-left">
              <div class="data-makanan-topbar-title">
                <h1>Data Makanan</h1>
                <p>Lihat daftar makanan dan informasi nutrisi</p>
              </div>
            </div>
            <div class="data-makanan-topbar-user">
              <div class="data-makanan-user-info">
                <p class="data-makanan-user-name">${escapeHTML(user.nama)}</p>
                <p class="data-makanan-user-role">Pasien</p>
              </div>
            </div>
          </div>

          <div class="data-makanan-dashboard-content">
            <!-- Filters -->
            <div class="data-makanan-table-section">
              <div class="data-makanan-filters">
                <input 
                  type="text" 
                  placeholder="Cari makanan... (cth: beras, daging, sayur)" 
                  class="data-makanan-filter-input" 
                  id="foodSearch"
                >
              </div>

              <!-- Table -->
              <div class="data-makanan-table-responsive">
                <table class="data-makanan-table">
                  <thead>
                    <tr>
                      <th style="width: 6%;">No</th>
                      <th style="width: 35%;">Nama Bahan & Pangan</th>
                      <th style="width: 12%;">Energi</th>
                      <th style="width: 12%;">Karbo</th>
                      <th style="width: 12%;">Protein</th>
                      <th style="width: 12%;">Lemak</th>
                    </tr>
                  </thead>
                  <tbody id="foodTable">
                    <tr>
                      <td colspan="6" style="text-align: center; padding: 2rem; color: #a0aec0;">
                        <div class="data-makanan-loading">Memuat data makanan...</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Stats -->
              <div class="data-makanan-stats">
                <div class="data-makanan-stat-item">
                  <span class="stat-label">Total Makanan:</span>
                  <span class="stat-value" id="totalFoods">0</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `;

  setupDataMakananEvents();
}

function setupDataMakananEvents() {
  const toggleSidebarBtn = document.getElementById("toggleSidebar");
  const sidebar = document.getElementById("userSidebar");
  const searchInput = document.getElementById("foodSearch");

  if (toggleSidebarBtn && sidebar) {
    toggleSidebarBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", handleFoodSearch);
  }

  setupUserSidebarLogout();
  loadFoodData();
}

async function loadFoodData() {
  try {
    const response = await getNutritionData();
    if (response.success && response.data) {
      renderFoodTable(response.data);
      updateFoodStats(response.data);
      window.allFoodData = response.data;
    }
  } catch (error) {
    console.error('Error loading food data:', error);
    const tableBody = document.getElementById("foodTable");
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2rem; color: #e53e3e;">
            ❌ Gagal memuat data makanan. Silakan coba lagi nanti.
          </td>
        </tr>
      `;
    }
  }
}

async function handleFoodSearch(event) {
  const searchQuery = event.target.value.trim();
  
  if (searchQuery === "") {
    // Tampilkan semua data jika search kosong
    if (window.allFoodData) {
      renderFoodTable(window.allFoodData);
      updateFoodStats(window.allFoodData);
    }
    return;
  }

  try {
    const response = await searchNutritionData(searchQuery);
    if (response.success && response.data) {
      renderFoodTable(response.data);
      updateFoodStats(response.data);
    } else {
      const tableBody = document.getElementById("foodTable");
      if (tableBody) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 2rem; color: #a0aec0;">
              Tidak ada hasil untuk "${searchQuery}"
            </td>
          </tr>
        `;
      }
    }
  } catch (error) {
    console.error('Error searching food data:', error);
  }
}

function renderFoodTable(foodList) {
  const tableBody = document.getElementById("foodTable");
  if (!tableBody) return;
  
  tableBody.innerHTML = "";

  if (!foodList || foodList.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: #a0aec0;">
          Tidak ada data makanan yang ditemukan
        </td>
      </tr>
    `;
    return;
  }

  foodList.forEach((food, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="text-align: center; font-weight: bold;">
        <span class="row-number">${index + 1}</span>
      </td>
      <td>
        <span class="food-name">${escapeHTML(food.nama_bahan || "N/A")}</span>
      </td>
      <td>
        <span class="nutrition-value">${food.energi_kal ? parseFloat(food.energi_kal).toFixed(0) : "0"}</span>
      </td>
      <td>
        <span class="nutrition-value">${food.karbohidrat_g ? parseFloat(food.karbohidrat_g).toFixed(1) : "0"}</span>
      </td>
      <td>
        <span class="nutrition-value">${food.protein_g ? parseFloat(food.protein_g).toFixed(1) : "0"}</span>
      </td>
      <td>
        <span class="nutrition-value">${food.lemak_g ? parseFloat(food.lemak_g).toFixed(1) : "0"}</span>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function updateFoodStats(foodList) {
  const totalFoods = foodList ? foodList.length : 0;
  
  const elTotal = document.getElementById("totalFoods");
  if (elTotal) {
    elTotal.textContent = totalFoods;
  }
}
