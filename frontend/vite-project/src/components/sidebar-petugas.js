import Swal from 'sweetalert2';
import "../styles/petugas-css/sidebar.css";

// Render Petugas Sidebar - for petugas role pages
export function renderPetugasSidebar(activePage = "") {
  return `
    <!-- Burger Button -->
    <button class="petugas-burger" id="petugasBurger" aria-label="Toggle menu">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Overlay Backdrop -->
    <div class="petugas-sidebar-overlay" id="petugasSidebarOverlay"></div>

    <!-- Sidebar Drawer -->
    <div class="petugas-sidebar" id="petugasSidebar">
      <div class="sidebar-header">
        <h2>Halo Petugas</h2>
        <button class="petugas-sidebar-close" id="petugasSidebarClose" aria-label="Close menu">✕</button>
      </div>
      <nav class="sidebar-nav">
        <a href="/petugas/dashboard" class="nav-link ${activePage === "dashboard" ? "active" : ""}">
          <span class="nav-icon">🏠</span>
          <span class="nav-text">Beranda</span>
        </a>
        <a href="/petugas/data-gizi" class="nav-link ${activePage === "data-gizi" ? "active" : ""}">
          <span class="nav-icon">🍎</span>
          <span class="nav-text">Data Gizi</span>
        </a>
        <a href="/petugas/rekomendasi" class="nav-link ${activePage === "rekomendasi" ? "active" : ""}">
          <span class="nav-icon">📊</span>
          <span class="nav-text">Rekomendasi</span>
        </a>
        <a href="/petugas/laporan" class="nav-link ${activePage === "laporan" ? "active" : ""}">
          <span class="nav-icon">📋</span>
          <span class="nav-text">Laporan</span>
        </a>
        <a href="/petugas/arsip" class="nav-link ${activePage === "arsip" ? "active" : ""}">
          <span class="nav-icon">🗂️</span>
          <span class="nav-text">Arsip Konsultasi</span>
        </a>
        <a href="/petugas/kelola-user" class="nav-link ${activePage === "kelola-user" ? "active" : ""}">
          <span class="nav-icon">👥</span>
          <span class="nav-text">Kelola User</span>
        </a>
        <a href="/petugas/konsumsi-user" class="nav-link ${activePage === "konsumsi-user" ? "active" : ""}">
          <span class="nav-icon">🍽️</span>
          <span class="nav-text">Pola Makan User</span>
        </a>
      </nav>
      <div class="sidebar-footer">
        <button class="sidebar-logout" id="logoutBtn">
          <span class="nav-icon">🚪</span>
          <span class="nav-text">Logout</span>
        </button>
      </div>
    </div>
  `;
}

// Setup Petugas Sidebar Logout
export function setupPetugasSidebarLogout() {
  // Burger toggle
  const burger = document.getElementById('petugasBurger');
  const sidebar = document.getElementById('petugasSidebar');
  const overlay = document.getElementById('petugasSidebarOverlay');
  const closeBtn = document.getElementById('petugasSidebarClose');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    burger.classList.add('active');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    burger.classList.remove('active');
  }

  burger?.addEventListener('click', openSidebar);
  overlay?.addEventListener('click', closeSidebar);
  closeBtn?.addEventListener('click', closeSidebar);

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      Swal.fire({
        title: 'Logout',
        text: "Anda yakin ingin keluar?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal'
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

// Render Admin Sidebar - for admin role pages (if needed in future)
export function renderAdminSidebar(activePage = "") {
  return renderPetugasSidebar(activePage);
}

// Setup Admin Sidebar Logout (same as petugas)
export function setupAdminSidebarLogout() {
  setupPetugasSidebarLogout();
}
