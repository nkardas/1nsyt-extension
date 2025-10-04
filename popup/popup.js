// popup/popup.js - Popup UI logic

console.log('[1nsyt Popup] Loaded');

// Load cache stats on popup open
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[1nsyt Popup] Initializing...');

  await loadCacheStats();
  setupEventListeners();
});

/**
 * Load cache statistics
 */
async function loadCacheStats() {
  try {
    // Get all data from Chrome Storage
    const allData = await chrome.storage.local.get(null);

    // Filter 1nsyt cache entries
    const cacheEntries = Object.entries(allData)
      .filter(([key]) => key.startsWith('1nsyt:'));

    // Calculate stats
    const count = cacheEntries.length;
    const estimatedSize = JSON.stringify(allData).length;
    const sizeKB = (estimatedSize / 1024).toFixed(1);

    // Update UI
    document.getElementById('cache-count').textContent = count;
    document.getElementById('cache-size').textContent = `${sizeKB} KB`;

    console.log('[1nsyt Popup] Cache stats:', { count, sizeKB });
  } catch (error) {
    console.error('[1nsyt Popup] Error loading cache stats:', error);
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Clear cache button
  document.getElementById('clear-cache-btn').addEventListener('click', async () => {
    console.log('[1nsyt Popup] Clear cache clicked');

    const confirmed = confirm('Are you sure you want to clear all cached 1nsyts?');

    if (!confirmed) {
      return;
    }

    try {
      // Get all cache keys
      const allData = await chrome.storage.local.get(null);
      const cacheKeys = Object.keys(allData).filter(key => key.startsWith('1nsyt:'));

      // Remove all cache entries
      await chrome.storage.local.remove(cacheKeys);

      console.log('[1nsyt Popup] Cache cleared:', cacheKeys.length, 'entries');

      // Reload stats
      await loadCacheStats();

      // Show success feedback
      alert(`Cache cleared! Removed ${cacheKeys.length} cached 1nsyts.`);
    } catch (error) {
      console.error('[1nsyt Popup] Error clearing cache:', error);
      alert('Error clearing cache. Please try again.');
    }
  });

  // Feedback link
  document.getElementById('feedback-link').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({
      url: 'https://github.com/nkardas/1nsyt-extension/issues/new'
    });
  });
}
