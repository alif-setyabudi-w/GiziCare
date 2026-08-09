import "../../styles/user-css/dashboard.css";
import { getUserData, getUserLatestRekomendasi } from "../../api/backend.js";
import { escapeHTML } from "../../utils/escapeHTML.js";
import { renderUserSidebar, setupUserSidebarLogout } from "../../components/sidebar-user.js";
import Swal from 'sweetalert2';


export async function renderUserDashboard(root) {
  const user = getUserData();

  // Cek Role
  if (!user || user.role !== "pasien") {
    window.location.href = "/login";
    return;
  }

  // Default values
  let bmiInfo = "Belum ada data";
  let kaloriInfo = "0 Kcal";
  let hasData = false;

  try {
    const response = await getUserLatestRekomendasi();
    if (response && response.rekomendasi) {
      hasData = true;
      const rekoData = response.rekomendasi;
      const berat = Number(rekoData.berat_badan) || 0;
      const tinggi = Number(rekoData.tinggi_badan) || 0;
      let bmi = Number(rekoData.bmi) || 0;
      if (tinggi > 0 && !rekoData.bmi) {
        bmi = berat / ((tinggi / 100) ** 2);
      }
      let bmiCategory = '';
      if (bmi < 18.5) {
        bmiCategory = 'Kurus';
      } else if (bmi >= 18.5 && bmi < 25) {
        bmiCategory = 'Normal';
      } else if (bmi >= 25 && bmi < 30) {
        bmiCategory = 'Kelebihan Berat';
      } else if (bmi >= 30) {
        bmiCategory = 'Obesitas';
      }
      bmiInfo = bmi ? `${bmi.toFixed(1)} (${bmiCategory})` : "-";
      kaloriInfo = rekoData.target_calories ? `${Math.round(Number(rekoData.target_calories))} Kcal` : "0 Kcal";
    }
  } catch (e) {
    // fallback: tetap tampilkan default
  }

  root.innerHTML = `
    <div class="user-wrapper">
      <div class="user-container">
        ${renderUserSidebar('dashboard')}
        
        <main class="user-main-content">
          <div class="user-topbar">
            <div class="topbar-welcome">
              <h1>👋 Halo, ${escapeHTML(user.nama)}</h1>
              <p>Selamat datang di dashboard kesehatan Anda</p>
            </div>
            
            <div class="topbar-actions">
              <div class="user-badge">Pasien</div>
            </div>
          </div>

          <div class="dashboard-grid">
            <div class="dashboard-card welcome-card">
              <div class="card-content">
                <h2>Mulai Hidup Sehat Hari Ini!</h2>
                <p>Dapatkan rekomendasi makanan yang sesuai dengan kebutuhan gizi harianmu dengan mudah.</p>
                <button class="btn-primary-action" onclick="window.location.href='/user/hasil-rekomendasi'">
                  ${hasData ? 'Lihat Hasil Terbaru' : 'Cek Rekomendasi Gizi'}
                </button>
              </div>
              <div class="card-illustration">🥗</div>
            </div>

            <div class="dashboard-card status-card">
              <h3>Status Terakhir</h3>
              <div class="stats-row">
                <div class="stat-item">
                  <span class="stat-label">Status BMI</span>
                  <span class="stat-value">${bmiInfo}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Target Kalori</span>
                  <span class="stat-value">${kaloriInfo}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="features-section">
            <h3>Fitur Anda</h3>
            <div class="features-grid">
              <div class="feature-item" onclick="window.location.href='/user/hasil-rekomendasi'">
                <span class="feature-icon">📋</span>
                <h4>Rekomendasi</h4>
                <p>Lihat menu makanan sehat</p>
              </div>
              <div class="feature-item" onclick="window.location.href='/user/data-makanan'">
                <span class="feature-icon">🥗</span>
                <h4>Data Makanan & Gizi</h4>
                <p>Lihat data makanan beserta kandungan gizinya</p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  `;

  setupEvents();
  setupUserSidebarLogout(); // Logout Sidebar
}

function setupEvents() {
  // Event Logout Header (Tambahan)
  const headerLogout = document.getElementById("headerLogoutBtn");
  if (headerLogout) {
    headerLogout.addEventListener("click", () => {
      Swal.fire({
        title: 'Logout?',
        text: "Anda akan keluar dari aplikasi",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Keluar'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      });
    });
  }
}