// Backend API Configuration
// Set VITE_API_BASE_URL di .env untuk production, default ke localhost untuk dev

// ===== PRODUCTION =====
// const API_BASE_URL = "https://backend-nutrient-production.up.railway.app/api";

// ===== LOCALHOST (DEVELOPMENT - DI-COMMENT) =====
const API_BASE_URL = "http://localhost:3000/api";

// Helper function untuk handle API responses
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP Error: ${response.status}`);
  }
  return response.json();
}

// === DASHBOARD & STATS ===
export const getDashboardStats = async () => {
  const token = sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // Kirim token jika ada
  };

  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: "GET",
      headers,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Gagal mengambil statistik");

    return result.stats; // Mengembalikan { totalUsers }
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// ==================== AUTH ENDPOINTS ====================

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: object}>}
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Register new user
 * @param {object} userData - { nama, email, password, role }
 * @returns {Promise<{message: string, user: object}>}
 */
export async function register(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
}

/**
 * Verify OTP code
 * @param {object} verifyData - { email, otp }
 * @returns {Promise<{message: string, user: object}>}
 */
export async function verifyOTP(verifyData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verifyData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw error;
  }
}

/**
 * Resend OTP code
 * @param {object} resendData - { email }
 * @returns {Promise<{message: string}>}
 */
export async function resendOTP(resendData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resendData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Resend OTP error:', error);
    throw error;
  }
}

export async function logout() {
  try {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

// ==================== ADMIN ENDPOINTS ====================

/**
 * Get all users (Admin only)
 * @returns {Promise<Array>}
 */
export async function getAllUsers() {
  try {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
}

/**
 * Get user by ID
 * @param {number} userId
 * @returns {Promise<object>}
 */
export async function getUserById(userId) {
  try {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
}

/**
 * Update user (Admin only)
 * @param {number} userId
 * @param {object} updateData
 * @returns {Promise<object>}
 */
export async function updateUser(userId, updateData) {
  try {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
}

/**
 * Delete user (Admin only)
 * @param {number} userId
 * @returns {Promise<{message: string}>}
 */
export async function deleteUser(userId) {
  try {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Set authentication token
 * @param {string} token
 */
export function setToken(token) {
  if (token) {
    sessionStorage.setItem('token', token);
  } else {
    sessionStorage.removeItem('token');
  }
}

export function getToken() {
  return sessionStorage.getItem('token');
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!getToken();
}

/**
 * Clear all authentication data
 */
export function clearAuth() {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}

/**
 * Store user data
 * @param {object} userData
 */
export function setUserData(userData) {
  sessionStorage.setItem('user', JSON.stringify(userData));
}

export function getUserData() {
  const user = sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}
// ==================== NUTRITION DATA ENDPOINTS ====================

/**
 * Get all nutrition data from CSV
 * @returns {Promise<{success: boolean, count: number, data: array}>}
 */
export async function getNutritionData() {
  try {
    const response = await fetch(`${API_BASE_URL}/gizi`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    throw error;
  }
}

/**
 * Search nutrition data by name
 * @param {string} query - Search query
 * @returns {Promise<{success: boolean, count: number, data: array}>}
 */
export async function searchNutritionData(query) {
  try {
    const response = await fetch(`${API_BASE_URL}/gizi/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error searching nutrition data:', error);
    throw error;
  }
}

// ==================== KNN RECOMMENDATION ENDPOINTS ====================

/**
 * Get nutrition recommendations based on user requirements
 * @param {array} nutrients - [protein, carbohydrate, fat, fiber]
 * @param {number} k - Number of recommendations (default: 5)
 * @returns {Promise<{success: boolean, recommendations: array}>}
 */
export async function getNutritionRecommendations(nutrients, k = 5) {
  try {
    const response = await fetch(`${API_BASE_URL}/rekomendasi/knn/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nutrients: nutrients,
        k: k,
        distance_metric: 'euclidean'
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error getting nutrition recommendations:', error);
    throw error;
  }
}

/**
 * Get nutritional profile analysis
 * @param {array} nutrients - [protein, carbohydrate, fat, fiber]
 * @returns {Promise<{success: boolean, profile: object}>}
 */
export async function getNutritionProfile(nutrients) {
  try {
    const response = await fetch(`${API_BASE_URL}/rekomendasi/knn/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nutrients: nutrients
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error getting nutrition profile:', error);
    throw error;
  }
}

/**
 * Predict food based on nutrients
 * @param {array} features - Array of [protein, carbs, fat, fiber]
 * @returns {Promise<{success: boolean, predictions: array}>}
 */
export async function predictFood(features) {
  try {
    const response = await fetch(`${API_BASE_URL}/rekomendasi/knn/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        features: features,
        distance_metric: 'euclidean'
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error predicting food:', error);
    throw error;
  }
}

// ==================== REKOMENDASI GIZI ====================

/**
 * Get food recommendations based on user profile
 * @param {Object} userProfile - User profile containing usia, berat, tinggi, jenis_kelamin, aktivitas, tujuan
 * @returns {Promise<Array>} - Array of food recommendations
 */
export async function getRekomendasi(userProfile) {
  const token = sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/rekomendasi`, {
      method: 'POST',
      headers,
      body: JSON.stringify(userProfile),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Gagal mendapatkan rekomendasi');
    }

    return result.recommendations || [];
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
}

// ==================== NUTRITION DATA ====================

/**
 * Get nutrition data from CSV database
 * @returns {Promise<Array>} - Array of nutrition data
 */
export async function getNutritionDataFromCSV() {
  const token = sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/gizi`, {
      method: 'GET',
      headers,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Gagal mengambil data gizi');
    }

    return result.data || [];
  } catch (error) {
    console.error('Error getting nutrition data:', error);
    throw error;
  }
}

// ==================== LAPORAN REKOMENDASI ====================

/**
 * Save rekomendasi to database (as a report/laporan)
 * @param {Object} user_profile - User profile data
 * @param {Object} target_nutrients - Target nutrients
 * @param {Array} recommendations - Recommendations array
 * @param {string} keterangan - Notes/keterangan
 * @param {number} konsultasi_id - Konsultasi ID (optional)
 * @param {number} user_id - User ID (optional)
 * @returns {Promise<Object>} - Result with rekomendasi_id
 * NOTE: petugas_id is automatically determined from JWT token on backend
 */
export async function saveRekomendasiReport(user_profile, target_nutrients, recommendations, keterangan = "", konsultasi_id = null, user_id = null) {
  const token = sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/rekomendasi/save-report`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        user_profile,
        target_nutrients,
        recommendations,
        keterangan,
        konsultasi_id,
        user_id,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Gagal menyimpan rekomendasi');
    }

    return result;
  } catch (error) {
    console.error('Error saving rekomendasi:', error);
    throw error;
  }
}

/**
 * Get list of laporan rekomendasi
 * @returns {Promise<Array>} - Array of laporan/rekomendasi
 */
export async function getLaporanList() {
  const token = sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/rekomendasi/laporan`, {
      method: 'GET',
      headers,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Gagal mengambil laporan');
    }

    return result.data || [];
  } catch (error) {
    console.error('Error getting laporan list:', error);
    throw error;
  }
}

/**
 * Get user's latest rekomendasi
 * @returns {Promise<Object>} - Object with rekomendasi and detail_makanan
 */
export async function getUserLatestRekomendasi() {
  const token = sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/rekomendasi/user/latest`, {
      method: 'GET',
      headers,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Gagal mengambil rekomendasi');
    }

    return result;
  } catch (error) {
    console.error('Error getting user latest rekomendasi:', error);
    throw error;
  }
}

/**
 * Get list rekomendasi untuk user
 * @returns {Promise<Object>} - Object with list of rekomendasi
 */
export async function getUserRekomendasiList() {
  const token = sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/rekomendasi/user/list`, {
      method: 'GET',
      headers,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Gagal mengambil daftar rekomendasi');
    }

    return result;
  } catch (error) {
    console.error('Error getting user rekomendasi list:', error);
    throw error;
  }
}

/**
 * Get detail rekomendasi untuk user
 * @param {number} id - Rekomendasi ID
 * @returns {Promise<Object>} - Object with rekomendasi and detail_makanan
 */
export async function getUserRekomendasiDetail(id) {
  const token = sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/rekomendasi/user/detail/${id}`, {
      method: 'GET',
      headers,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Gagal mengambil detail rekomendasi');
    }

    return result;
  } catch (error) {
    console.error('Error getting user rekomendasi detail:', error);
    throw error;
  }
}

/**
 * Get detail laporan rekomendasi
 * @param {number} id - Rekomendasi ID
 * @returns {Promise<Object>} - Object with rekomendasi and detail_makanan
 */
export async function getLaporanDetail(id) {
  const token = sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/rekomendasi/laporan/${id}`, {
      method: 'GET',
      headers,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Gagal mengambil detail laporan');
    }

    return result;
  } catch (error) {
    console.error('Error getting laporan detail:', error);
    throw error;
  }
}

/**
 * Delete laporan rekomendasi
 * @param {number} id - Rekomendasi ID
 * @returns {Promise<Object>}
 */
export async function deleteLaporan(id) {
  const token = sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/rekomendasi/laporan/${id}`, {
      method: 'DELETE',
      headers,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Gagal menghapus laporan');
    }

    return result;
  } catch (error) {
    console.error('Error deleting laporan:', error);
    throw error;
  }
}

// ==================== KONSULTASI GIZI ====================

/**
 * Get daftar konsultasi yang masuk (untuk petugas)
 * @param {string} status - Filter berdasarkan status (pending, diproses, selesai, semua)
 * @returns {Promise<Array>} - Array of konsultasi
 */
export async function getKonsultasiList(status = "all") {
  const token = sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    let url = `${API_BASE_URL}/konsultasi`;
    if (status !== "all") {
      url += `?status=${status}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Gagal mengambil daftar konsultasi");
    }

    return result.data || [];
  } catch (error) {
    console.error("Error getting konsultasi list:", error);
    throw error;
  }
}

/**
 * Get detail konsultasi
 * @param {number} id - Konsultasi ID
 * @returns {Promise<Object>}
 */
export async function getKonsultasiDetail(id) {
  const token = sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/konsultasi/${id}`, {
      method: "GET",
      headers,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Gagal mengambil detail konsultasi");
    }

    return result.data;
  } catch (error) {
    console.error("Error getting konsultasi detail:", error);
    throw error;
  }
}

/**
 * Update status konsultasi (untuk petugas respond)
 * @param {number} id - Konsultasi ID
 * @param {string} status - Status baru (diproses, selesai, ditolak)
 * @param {string} respons - Response/rekomendasi dari petugas
 * @returns {Promise<Object>}
 */
export async function updateKonsultasiStatus(id, status, respons = "") {
  const token = sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/konsultasi/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ status, respons }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Gagal mengupdate konsultasi");
    }

    return result;
  } catch (error) {
    console.error("Error updating konsultasi:", error);
    throw error;
  }
}

// ==================== GIVE REKOMENDASI TO USER ====================

/**
 * Get available laporan yang bisa diberikan ke user tertentu
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - Array of available laporan
 */
export async function getAvailableLaporanForUser(userId) {
  const token = sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/rekomendasi/available/${userId}`, {
      method: "GET",
      headers,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Gagal mengambil daftar laporan");
    }

    return result.data || [];
  } catch (error) {
    console.error("Error getting available laporan:", error);
    throw error;
  }
}

/**
 * Hapus konsultasi
 * @param {number} id - Konsultasi ID
 * @returns {Promise<Object>}
 */
export async function deleteKonsultasi(id) {
  const token = sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/konsultasi/${id}`, {
      method: "DELETE",
      headers,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Gagal menghapus konsultasi");
    }

    return result;
  } catch (error) {
    console.error("Error deleting konsultasi:", error);
    throw error;
  }
}

/**
 * Berikan laporan rekomendasi kepada user
 * @param {number} rekoId - Rekomendasi ID
 * @param {number} userId - User ID yang akan menerima
 * @returns {Promise<Object>}
 */
export async function giveRekomendasiToUser(rekoId, userId, konsultasiId = null) {
  const token = sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/rekomendasi/${rekoId}/give-to-user/${userId}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ konsultasi_id: konsultasiId }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Gagal memberikan rekomendasi");
    }

    return result;
  } catch (error) {
    console.error("Error giving rekomendasi to user:", error);
    throw error;
  }
}

// ==================== KONSUMSI MAKANAN HARIAN ====================

function authHeaders() {
  const token = sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function addKonsumsi(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/konsumsi`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("addKonsumsi error:", error);
    throw error;
  }
}

export async function getKonsumsiByUser(userId, tanggal = null) {
  try {
    let url = `${API_BASE_URL}/konsumsi/user/${userId}`;
    if (tanggal) url += `?tanggal=${tanggal}`;
    const response = await fetch(url, { method: "GET", headers: authHeaders() });
    return await handleResponse(response);
  } catch (error) {
    console.error("getKonsumsiByUser error:", error);
    throw error;
  }
}

export async function getAllKonsumsi(userId = null, tanggal = null) {
  try {
    const params = new URLSearchParams();
    if (userId) params.append("user_id", userId);
    if (tanggal) params.append("tanggal", tanggal);
    const url = `${API_BASE_URL}/konsumsi${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, { method: "GET", headers: authHeaders() });
    return await handleResponse(response);
  } catch (error) {
    console.error("getAllKonsumsi error:", error);
    throw error;
  }
}

export async function updateKonsumsi(id, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/konsumsi/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("updateKonsumsi error:", error);
    throw error;
  }
}

export async function deleteKonsumsiItem(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/konsumsi/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("deleteKonsumsiItem error:", error);
    throw error;
  }
}

