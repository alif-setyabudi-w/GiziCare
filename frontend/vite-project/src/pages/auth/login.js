import '../../styles/login.css';
import { login, setToken, setUserData } from '../../api/backend.js';

export function renderLogin(root) {
  // ... (HTML form tetap sama) ...
  root.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Login GiziCare</h2>
        <form id="loginForm">
          <input type="email" id="email" placeholder="Masukkan email Anda" required />
          <input type="password" id="password" placeholder="Masukkan password" required />
          <button type="submit">Masuk</button>
          <div id="loginError" class="error-message" style="display:none;"></div>
          <div id="loginLoading" class="loading-message" style="display:none;">Sedang login...</div>
        </form>
        <div class="auth-footer">
          <p>Belum punya akun? <a href="/register" id="goRegister">Daftar</a></p>
        </div>
      </div>
    </div>
  `;

  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  const loginLoading = document.getElementById("loginLoading");
  const submitBtn = loginForm.querySelector("button");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      loginError.style.display = "none";
      loginLoading.style.display = "block";
      submitBtn.disabled = true;

      const response = await login(email, password);

      // Simpan token dan user data
      setToken(response.token);
      setUserData(response.user);

      // === PERBAIKAN LOGIKA REDIRECT DI SINI ===
      const role = response.user.role;
      
      if (role === "ahli_gizi") {
        window.location.href = "/petugas/dashboard";
      } else if (role === "pasien") {
        // Arahkan Pasien ke Dashboard Pasien, BUKAN ke Home (/)
        window.location.href = "/user/dashboard";
      } else {
        // Fallback jika role tidak dikenali
        window.location.href = "/";
      }
      
    } catch (error) {
      loginError.textContent = error.message || "Login gagal. Cek email dan password.";
      loginError.style.display = "block";
      loginLoading.style.display = "none";
      submitBtn.disabled = false;
    }
  });

  // ... (Event listener register tetap sama) ...
  document.getElementById("goRegister").addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState({}, "", "/register");
    window.dispatchEvent(new Event("popstate"));
  });
}