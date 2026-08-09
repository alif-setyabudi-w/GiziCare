import './style.css';
import { renderLogin } from './pages/auth/login.js';
import { renderRegister } from './pages/auth/register.js';
import { renderVerifyOTP } from './pages/auth/verify-otp.js';
import { renderHome } from './pages/home/home.js';

// Import Halaman Petugas (Dahulu Admin)
import { renderPetugasDashboard } from './pages/petugas/dashboard-petugas.js';
import { renderPetugasDataGizi } from './pages/petugas/data-gizi-petugas.js';
import { renderPetugasKelolaUser } from './pages/petugas/kelola-user-petugas.js'; // Pastikan file ini ada
import { renderPetugasLaporan } from './pages/petugas/laporan-petugas.js';       // Pastikan file ini ada
import { renderPetugasRekomendasi } from './pages/petugas/rekomendasi-gizi-petugas.js';
import { renderPetugasHasilRekomendasi } from './pages/petugas/hasil-rekomendasi.js';
import { renderKonsultasiResponse } from './pages/petugas/konsultasi-response.js';
import { renderArsip } from './pages/petugas/arsip.js';

// Import Halaman User (Dahulu Petugas)
import { renderUserDashboard } from './pages/user/dashboard-user.js'; // Buat folder user jika belum ada
import { renderUserHasilRekomendasi } from './pages/user/hasil-rekomendasi.js';
import { renderUserDataMakanan} from './pages/user/data-makanan.js';
import { renderUserKonsultasi } from './pages/user/konsultasi-rekomendasi.js';
import { renderUserKonsumsiMakanan } from './pages/user/konsumsi-makanan.js';
import { renderPetugasKonsumsiUser } from './pages/petugas/konsumsi-user.js';

const root = document.querySelector('#app');

function navigateTo(path) {
  history.pushState({}, "", path);
  router();
}

function router() {
  const path = window.location.pathname;
  root.innerHTML = "";

  // === PUBLIC ROUTES ===
  if (path === "/" || path === "/home") {
    renderHome(root);
  } else if (path === "/login") {
    renderLogin(root);
  } else if (path === "/register") {
    renderRegister(root);
  } else if (path === "/verify-otp") {
    // Ambil email dari sessionStorage
    const email = sessionStorage.getItem('verifyEmail') || '';
    renderVerifyOTP(root, email);
  }
  
  // === ROUTES PETUGAS (Eks Admin) ===
  else if (path === "/petugas/dashboard") {
    renderPetugasDashboard(root);
  } else if (path === "/petugas/data-gizi") {
    renderPetugasDataGizi(root);
  } else if (path === "/petugas/rekomendasi") {
    renderPetugasRekomendasi(root);
  } else if (path === "/petugas/hasil-rekomendasi") {
    renderPetugasHasilRekomendasi(root);
  } else if (path === "/petugas/konsultasi") {
    renderKonsultasiResponse(root);
  } else if (path === "/petugas/kelola-user") {
    renderPetugasKelolaUser(root); // Menu khusus Petugas (kelola User/Masyarakat)
  } else if (path === "/petugas/laporan") {
    renderPetugasLaporan(root);
  } else if (path === "/petugas/arsip") {
    renderArsip(root);
  }

  // === ROUTES USER (Eks Petugas) ===
  else if (path === "/user/dashboard") {
    renderUserDashboard(root);
  } else if (path === "/user/hasil-rekomendasi") {
    renderUserHasilRekomendasi(root);
  } else if (path === "/user/konsultasi-rekomendasi") {
    renderUserKonsultasi(root);
  } else if (path === "/user/data-makanan") {
    renderUserDataMakanan(root);
  } else if (path === "/user/konsumsi-makanan") {
    renderUserKonsumsiMakanan(root);
  } else if (path === "/petugas/konsumsi-user") {
    renderPetugasKonsumsiUser(root);
  }

  else {
    root.innerHTML = "<h1>404 - Halaman Tidak Ditemukan</h1>";
  }
}

window.addEventListener("popstate", router);
document.addEventListener("DOMContentLoaded", router);

// Expose navigateTo function globally if needed
window.navigateTo = navigateTo;