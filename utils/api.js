// utils/api.js - API client for 1nsyt backend

const API_BASE_URL = 'http://localhost:3003';

/**
 * Generate 1nsyt from backend API
 * @param {object} profileData - Profile data (name, title, location)
 * @returns {Promise<object>} API response with summary and starters
 */
export async function generate1nsyt(profileData) {
  try {
    console.log('[API Client] Requesting 1nsyt from backend...');

    const response = await fetch(`${API_BASE_URL}/api/1nsyt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: profileData.name,
        title: profileData.title,
        location: profileData.location || null
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();

    console.log('[API Client] Success!', data.usage);

    return {
      success: true,
      data: data.data,
      usage: data.usage
    };

  } catch (error) {
    console.error('[API Client] Error:', error);

    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Check API health
 * @returns {Promise<boolean>} True if API is responsive
 */
export async function checkAPIHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('[API Client] Health check failed:', error);
    return false;
  }
}
