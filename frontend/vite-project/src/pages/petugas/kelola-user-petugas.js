import "../../styles/petugas-css/dashboard.css";
import "../../styles/petugas-css/kelola-user.css";
import { getUserData, getAllUsers, deleteUser } from "../../api/backend.js";
import { renderPetugasSidebar, setupPetugasSidebarLogout } from "../../components/sidebar-petugas.js";

export function renderPetugasKelolaUser(root) {
  const user = getUserData();

  // CEK ROLE: Ahli Gizi
  if (!user || user.role !== "ahli_gizi") {
    window.location.href = "/login";
    return;
  }

  root.innerHTML = `
    <div class="petugas-wrapper">
        ${renderPetugasSidebar('kelola-user')}
        
        <main class="petugas-main-content">
          <div class="petugas-topbar">
            <div class="topbar-welcome">
              <h1>👥 Kelola User</h1>
              <p style="color:#ffff;">Manajemen data masyarakat (pengguna aplikasi)</p>
            </div>
            <div class="topbar-profile">
              <div class="avatar">${user.nama?.charAt(0).toUpperCase()}</div>
            </div>
          </div>

          <div class="petugas-dashboard-content">
            <div class="kelola-user-section">
              <div class="section-header">
                <h2>📋 Daftar User</h2>
                <div class="section-stats">
                  <span id="totalUserCount">0 User Terdaftar</span>
                </div>
              </div>

              <div class="kelola-user-filters">
                <input 
                  type="text" 
                  placeholder="🔍 Cari nama atau email user..." 
                  id="userSearch" 
                  class="kelola-user-search"
                >
              </div>

              <div class="kelola-user-table-responsive">
                <table class="kelola-user-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>Email</th>
                      <th>Terdaftar</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody id="usersTable">
                    <tr class="loading-row">
                      <td colspan="5" style="text-align: center; padding: 3rem;">
                        <div class="kelola-user-loading">
                          <p>⏳ Memuat data user...</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
    </div>
  `;

  setupPetugasKelolaUserEvents();
  setupPetugasSidebarLogout();
}

let allUsers = [];

function setupPetugasKelolaUserEvents() {
  const userSearchInput = document.getElementById("userSearch");
  
  if (userSearchInput) {
    userSearchInput.addEventListener("input", (e) => {
      filterUsers(e.target.value);
    });
  }

  loadUserData();
}

async function loadUserData() {
  const usersTable = document.getElementById("usersTable");
  const totalUserCount = document.getElementById("totalUserCount");
  
  if (!usersTable) return;

  try {
    // Fetch data dari API
    const response = await getAllUsers();
    
    // Filter hanya pasien dengan role 'pasien'
    allUsers = response.data.filter(u => u.role === 'pasien');

    if (totalUserCount) {
      totalUserCount.textContent = `${allUsers.length} Pasien Terdaftar`;
    }

    renderUserTable(allUsers);
  } catch (error) {
    console.error("Error loading users:", error);
    usersTable.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 3rem;">
          <div class="kelola-user-error">
            <p>❌ Gagal memuat data user</p>
            <small>${error.message}</small>
          </div>
        </td>
      </tr>
    `;
  }
}

function renderUserTable(users) {
  const usersTable = document.getElementById("usersTable");
  
  if (!usersTable) return;

  if (users.length === 0) {
    usersTable.innerHTML = `
      <tr class="empty-row">
        <td colspan="5" style="text-align: center; padding: 3rem;">
          <div class="kelola-user-empty">
            <p>✨ Belum ada user terdaftar</p>
            <small>User baru akan muncul di sini setelah registrasi</small>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  usersTable.innerHTML = users.map((u, index) => {
    const createdDate = new Date(u.created_at).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return `
      <tr class="user-row" data-user-id="${u.id}">
        <td><span class="row-number">${index + 1}</span></td>
        <td>
          <div class="user-name">
            <div class="user-avatar">${u.name?.charAt(0).toUpperCase() || '?'}</div>
            <span>${u.name || '-'}</span>
          </div>
        </td>
        <td><span class="email-badge">${u.email || '-'}</span></td>
        <td><span class="date-badge">${createdDate}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn-detail" onclick="viewUserDetail(${u.id})">Detail</button>
            <button class="btn-delete" onclick="deleteUserAction(${u.id}, '${u.name}')">Hapus</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function filterUsers(searchTerm) {
  const filtered = allUsers.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower))
    );
  });

  renderUserTable(filtered);
}

// Function untuk view detail user
window.viewUserDetail = function(userId) {
  const user = allUsers.find(u => u.id === userId);
  if (user) {
    const createdDate = new Date(user.created_at).toLocaleDateString('id-ID');
    alert(`Detail User:\n\nNama: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nTerdaftar: ${createdDate}`);
  }
};

// Function untuk delete user
window.deleteUserAction = async function(userId, userName) {
  if (!confirm(`Apakah Anda yakin ingin menghapus user "${userName}"?\n\nTindakan ini tidak dapat dibatalkan.`)) {
    return;
  }

  try {
    const result = await deleteUser(userId);
    
    if (result.success) {
      alert(`✅ ${result.message}`);
      // Reload data user
      loadUserData();
    } else {
      alert(`❌ Gagal: ${result.message}`);
    }
  } catch (error) {
    alert(`❌ Error: ${error.message}`);
    console.error("Delete user error:", error);
  }
};