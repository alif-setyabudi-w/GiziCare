import '../../styles/login.css';
import { verifyOTP, resendOTP } from '../../api/backend.js';

export function renderVerifyOTP(root, email) {
  root.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Verifikasi Email</h2>
        <p class="verify-subtitle">Kode OTP telah dikirim ke:</p>
        <p class="email-display">${email}</p>
        
        <form id="verifyOTPForm">
          <div class="otp-inputs-container">
            <input type="text" id="otp" placeholder="Masukkan kode OTP (6 digit)" maxlength="6" required />
          </div>
          <button type="submit">Verifikasi</button>
          <div id="verifyError" class="error-message" style="display:none;"></div>
          <div id="verifySuccess" class="success-message" style="display:none;"></div>
          <div id="verifyLoading" class="loading-message" style="display:none;">Sedang memverifikasi...</div>
        </form>

        <div class="auth-footer">
          <p>Belum menerima kode? <a href="#" id="resendOTP" class="resend-link">Kirim ulang</a></p>
          <p><a href="/register" id="goRegister">Kembali ke Registrasi</a></p>
        </div>

        <div class="otp-info">
          <p>ℹ️ Kode OTP berlaku selama 10 menit</p>
          <p>Jika Anda tidak melakukan registrasi, abaikan pesan ini</p>
        </div>
      </div>
    </div>
  `;

  const verifyForm = document.getElementById("verifyOTPForm");
  const verifyError = document.getElementById("verifyError");
  const verifySuccess = document.getElementById("verifySuccess");
  const verifyLoading = document.getElementById("verifyLoading");
  const resendBtn = document.getElementById("resendOTP");
  const submitBtn = verifyForm.querySelector("button");
  let resendCooldown = 0;

  // OTP input - hanya angka
  const otpInput = document.getElementById("otp");
  otpInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  });

  // Verifikasi OTP
  verifyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const otp = document.getElementById("otp").value.trim();

    // Validasi input
    if (!otp || otp.length !== 6) {
      showError("Kode OTP harus 6 digit!");
      return;
    }

    try {
      hideMessages();
      verifyLoading.style.display = "block";
      submitBtn.disabled = true;

      const response = await verifyOTP({ email, otp });

      showSuccess("✅ Email terverifikasi! Silakan login.");

      setTimeout(() => {
        history.pushState({}, "", "/login");
        window.dispatchEvent(new Event("popstate"));
      }, 2000);
    } catch (error) {
      const errorMsg = error.message || "Verifikasi gagal. Silakan coba lagi.";
      
      if (errorMsg.includes("kode OTP tidak valid")) {
        showError("❌ Kode OTP tidak valid atau sudah kadaluarsa.");
      } else if (errorMsg.includes("User tidak ditemukan")) {
        showError("❌ User tidak ditemukan. Silakan registrasi ulang.");
      } else {
        showError("❌ " + errorMsg);
      }

      verifyLoading.style.display = "none";
      submitBtn.disabled = false;
    }
  });

  // Resend OTP
  resendBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (resendCooldown > 0) {
      alert(`Tunggu ${resendCooldown} detik sebelum mengirim ulang`);
      return;
    }

    try {
      resendBtn.disabled = true;
      const response = await resendOTP({ email });
      
      showSuccess("✅ Kode OTP baru telah dikirim ke email Anda");
      
      // Cooldown 60 detik
      resendCooldown = 60;
      const cooldownInterval = setInterval(() => {
        resendCooldown--;
        resendBtn.textContent = `Kirim ulang (${resendCooldown}s)`;
        
        if (resendCooldown <= 0) {
          clearInterval(cooldownInterval);
          resendBtn.textContent = "Kirim ulang";
          resendBtn.disabled = false;
        }
      }, 1000);
    } catch (error) {
      showError("❌ Gagal mengirim ulang OTP: " + error.message);
      resendBtn.disabled = false;
    }
  });

  function showError(message) {
    hideMessages();
    verifyError.textContent = message;
    verifyError.style.color = "#d32f2f";
    verifyError.style.display = "block";
  }

  function showSuccess(message) {
    hideMessages();
    verifySuccess.textContent = message;
    verifySuccess.style.color = "#388e3c";
    verifySuccess.style.display = "block";
  }

  function hideMessages() {
    verifyError.style.display = "none";
    verifySuccess.style.display = "none";
  }
}
