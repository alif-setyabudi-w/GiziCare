import '../../styles/home.css';
import logo from '../../assets/logo.jpeg';

export function renderHome(root) {
  root.innerHTML = `
    <div class="home-container">
      <div class="navbar-home">
        <div class="navbar-logo">
          <img src="${logo}" alt="GiziCare Logo" class="logo-img" />
          <span class="logo-text"><span style="color: #07d425;">Gizi</span><span style="color: #1659eb;">Care</span></span>
        </div>
      </div>
      
      <div class="home-content">
        <h1>Selamat Datang di <span style="color: #07d425;">Gizi</span><span style="color: #1659eb;">Care</span></h1>
        <p>Aplikasi Rekomendasi makanan yang membantu anda mendapatkan nutrisi yang optimal dengan bantuan dari ahli gizi.</p>
        <div class="home-links">
          <a href="/login" class="btn-primary">Masuk</a>
          <a href="/register" class="btn-secondary">Daftar</a>
        </div>
      </div>
    </div>
  `;
}