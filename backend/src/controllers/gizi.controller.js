import axios from "axios";

// Get ML Service URL from environment or use default
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5001";

// Cache for nutrition data
let cachedNutritionData = null;
let cacheLoaded = false;
let lastCacheTime = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

/**
 * Get nutrition data dari Python ML Service
 * Python service baca CSV dan expose data via API
 */
const getNutritionDataFromMLService = async () => {
  try {
    console.log(`[Gizi Controller] Fetching nutrition data from ML Service: ${ML_SERVICE_URL}/api/nutrition`);
    
    const response = await axios.get(`${ML_SERVICE_URL}/api/nutrition`, {
      timeout: parseInt(process.env.ML_SERVICE_TIMEOUT || "30000"),
    });

    if (!response.data || !response.data.data) {
      throw new Error("Invalid response format from ML Service");
    }

    console.log(`[Gizi Controller] Loaded ${response.data.count} nutrition items from ML Service`);
    return response.data.data;
  } catch (error) {
    console.error("[Gizi Controller] Error fetching from ML Service:", error.message);
    throw new Error(`Failed to fetch nutrition data from ML Service: ${error.message}`);
  }
};

/**
 * Search nutrition data dari Python ML Service
 */
const searchNutritionDataFromMLService = async (query) => {
  try {
    console.log(`[Gizi Controller] Searching nutrition data from ML Service: ${query}`);
    
    const response = await axios.get(`${ML_SERVICE_URL}/api/nutrition/search`, {
      params: { query },
      timeout: parseInt(process.env.ML_SERVICE_TIMEOUT || "30000"),
    });

    if (!response.data || !response.data.data) {
      throw new Error("Invalid response format from ML Service");
    }

    console.log(`[Gizi Controller] Found ${response.data.count} nutrition items`);
    return response.data.data;
  } catch (error) {
    console.error("[Gizi Controller] Error searching from ML Service:", error.message);
    throw new Error(`Failed to search nutrition data: ${error.message}`);
  }
};

export const getNutritionData = async (req, res) => {
  try {
    // Cache data untuk 1 jam
    if (!cacheLoaded || Date.now() - lastCacheTime > CACHE_DURATION) {
      console.log("[Gizi Controller] Fetching nutrition data from ML Service...");
      cachedNutritionData = await getNutritionDataFromMLService();
      cacheLoaded = true;
      lastCacheTime = Date.now();
      console.log(`[Gizi Controller] Cached ${cachedNutritionData.length} nutrition items (expires in ${CACHE_DURATION / 60000} minutes)`);
    }

    res.json({
      success: true,
      count: cachedNutritionData.length,
      data: cachedNutritionData,
    });
  } catch (error) {
    console.error("[Gizi Controller] Error loading nutrition data:", error.message);
    console.error("[Gizi Controller] Full error:", error);
    res.status(500).json({
      success: false,
      message: "Error loading nutrition data from ML Service",
      error: error.message,
      hint: "Make sure ML Service (Python Flask) is running on port 5001"
    });
  }
};

export const searchNutritionData = async (req, res) => {
  const { query } = req.query;

  try {
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required",
      });
    }

    // Use cached data if available, otherwise fetch from ML Service
    if (!cachedNutritionData || !cacheLoaded) {
      cachedNutritionData = await getNutritionDataFromMLService();
      cacheLoaded = true;
      lastCacheTime = Date.now();
    }

    // Filter dari cached data - gunakan nama_bahan, bukan name
    const filtered = cachedNutritionData.filter((item) =>
      item.nama_bahan.toLowerCase().includes(query.toLowerCase())
    );

    res.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    console.error("Error searching nutrition data:", error);
    res.status(500).json({
      success: false,
      message: "Error searching nutrition data",
      error: error.message,
    });
  }
};

