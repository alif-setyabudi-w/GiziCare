import Swal from 'sweetalert2';
import '../styles/user-css/sidebar-user.css';

export function renderUserSidebar(activePage = "") {
  return `
    <!-- Burger Button -->
    <button class="sidebar-burger" id="sidebarBurger" aria-label="Toggle menu">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Overlay Backdrop -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <!-- Sidebar Drawer -->
    <div class="user-sidebar" id="userSidebar">
      <div class="sidebar-header">
        <span>NutriFood</span>
        <button class="sidebar-close" id="sidebarClose" aria-label="Close menu">✕</button>
      </div>
      <nav class="sidebar-nav">
        <a href="/user/dashboard" class="nav-link ${activePage === "dashboard" ? "active" : ""}">
          <span class="nav-icon">🏠</span>
          <span class="nav-text">Beranda</span>
        </a>
        <a href="/user/hasil-rekomendasi" class="nav-link ${activePage === "hasil-rekomendasi" ? "active" : ""}">
          <span class="nav-icon">📋</span>
          <span class="nav-text">Hasil Rekomendasi</span>
        </a>
        <a href="/user/konsultasi-rekomendasi" class="nav-link ${activePage === "konsultasi" ? "active" : ""}">
          <span class="nav-icon">💬</span>
          <span class="nav-text">Konsultasi</span>
        </a>
        <a href="/user/data-makanan" class="nav-link ${activePage === "data-gizi" ? "active" : ""}">
          <span class="nav-icon">🍔</span>
          <span class="nav-text">Gizi Makanan</span>
        </a>
        <a href="/user/konsumsi-makanan" class="nav-link ${activePage === "konsumsi-makanan" ? "active" : ""}">
          <span class="nav-icon">🍽️</span>
          <span class="nav-text">Konsumsi Harian</span>
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

export function setupUserSidebarLogout() {
  // Burger toggle
  const burger = document.getElementById('sidebarBurger');
  const sidebar = document.getElementById('userSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const closeBtn = document.getElementById('sidebarClose');

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