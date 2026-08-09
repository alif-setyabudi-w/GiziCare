import '../../styles/login.css';
import { register } from '../../api/backend.js';
import { renderVerifyOTP } from './verify-otp.js';

export function renderRegister(root) {
  root.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Registrasi Akun</h2>
        <form id="registerForm">
          <input type="text" id="nama" placeholder="Nama Pengguna (Username)" required />
          <input type="email" id="email" placeholder="Email" required />
          <input type="password" id="password" placeholder="Password" required />
          <input type="password" id="confirmPassword" placeholder="Konfirmasi Password" required />
          <button type="submit">Daftar</button>
          <div id="registerError" class="error-message" style="display:none;"></div>
          <div id="registerSuccess" class="success-message" style="display:none;"></div>
          <div id="registerLoading" class="loading-message" style="display:none;">Sedang mendaftar...</div>
        </form>
        <div class="auth-footer">
          <p>Sudah punya akun? <a href="/login" id="goLogin">Login</a></p>
        </div>
      </div>
    </div>
  `;

  const registerForm = document.getElementById("registerForm");
  const registerError = document.getElementById("registerError");
  const registerSuccess = document.getElementById("registerSuccess");
  const registerLoading = document.getElementById("registerLoading");
  const submitBtn = registerForm.querySelector("button");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const nama = document.getElementById("nama").value.trim();
    const email = document.getElementById("email").value.trim();

    // Validasi password
    if (password !== confirmPassword) {
      showError("Password tidak sama!");
      return;
    }

    // Validasi input kosong
    if (!nama || !email || !password) {
      showError("Semua field harus diisi!");
      return;
    }

    const userData = {
      nama,
      email,
      password,
      role: "pasien",
    };

    try {
      hideMessages();
      registerLoading.style.display = "block";
      submitBtn.disabled = true;

      const response = await register(userData);

      // Registrasi berhasil - arahkan ke halaman verifikasi OTP
      showSuccess("✅ Pendaftaran berhasil! Silakan verifikasi email Anda.");
      
      // Simpan email untuk halaman verifikasi
      sessionStorage.setItem('verifyEmail', email);

      setTimeout(() => {
        history.pushState({}, "", "/verify-otp");
        window.dispatchEvent(new Event("popstate"));
      }, 1500);
    } catch (error) {
      const errorMsg = error.message || "Pendaftaran gagal. Silakan coba lagi.";
      
      // Tampilkan pesan error yang spesifik
      if (errorMsg.includes("Email sudah terdaftar")) {
        showError("❌ Email '" + email + "' sudah terdaftar.");
      } else if (errorMsg.includes("Gagal mengirim OTP")) {
        showError("❌ Gagal mengirim OTP ke email. Pastikan EMAIL_USER dan EMAIL_PASSWORD sudah dikonfigurasi di server. Silakan hubungi admin atau coba lagi nanti.");
      } else {
        showError("❌ " + errorMsg);
      }
      
      registerLoading.style.display = "none";
      submitBtn.disabled = false;
    }
  });

  function showError(message) {
    hideMessages();
    registerError.textContent = message;
    registerError.style.color = "#d32f2f";
    registerError.style.display = "block";
  }

  function showSuccess(message) {
    hideMessages();
    registerSuccess.textContent = message;
    registerSuccess.style.color = "#388e3c";
    registerSuccess.style.display = "block";
  }

  function hideMessages() {
    registerError.style.display = "none";
    registerSuccess.style.display = "none";
    registerLoading.style.display = "none";
  }

  document.getElementById("goLogin").addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState({}, "", "/login");
    window.dispatchEvent(new Event("popstate"));
  });
}