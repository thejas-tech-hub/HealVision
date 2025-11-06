// frontend/src/lib/api.js

// Base API URL (uses .env value or defaults to localhost)
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
console.log("🌐 Using API_BASE:", API_BASE);

/**
 * Analyze text symptoms
 * @param {Object} data
 * @param {number} data.age
 * @param {string} data.gender
 * @param {string} [data.allergies]
 * @param {string} data.symptomsText
 * @param {string} data.targetLanguage
 * @returns {Promise<Object>} AnalysisResult
 */
export const analyzeText = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/api/analyze/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // ✅ Ensure backend receives both 'text' and metadata
      body: JSON.stringify({
        text: data.symptomsText,
        ...data,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to analyze symptoms (${response.status}): ${errText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("❌ Error in analyzeText:", err);
    throw err;
  }
};

/**
 * Analyze uploaded medical image
 * @param {Object} data
 * @param {File} data.image
 * @param {string} data.targetLanguage
 * @returns {Promise<Object>} AnalysisResult
 */
export const analyzeImage = async (data) => {
  try {
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('targetLanguage', data.targetLanguage);

    const response = await fetch(`${API_BASE}/api/analyze/image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to analyze image (${response.status}): ${errText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("❌ Error in analyzeImage:", err);
    throw err;
  }
};

/**
 * Send chat messages (mind-care / assistant)
 * @param {Object} data
 * @param {Array<{role: string, content: string}>} data.messages
 * @param {boolean} data.mindCare
 * @param {string} data.targetLanguage
 * @param {Object} data.profile
 * @returns {Promise<Response>}
 */
export const sendChatMessage = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to send message (${response.status}): ${errText}`);
    }

    return response;
  } catch (err) {
    console.error("❌ Error in sendChatMessage:", err);
    throw err;
  }
};
