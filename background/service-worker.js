// background/service-worker.js - Background service worker for 1nsyt
// Manifest V3 architecture: event-driven, not persistent

import { cache1nsyt, getCached1nsyt, clearCache, cleanupExpiredCache } from '../utils/storage.js';

console.log('[1nsyt] Service worker initialized');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[1nsyt] Extension installed:', details.reason);

  if (details.reason === 'install') {
    console.log('[1nsyt] First install - Welcome!');
    // TODO: Show onboarding popup
  } else if (details.reason === 'update') {
    console.log('[1nsyt] Extension updated to version:', chrome.runtime.getManifest().version);
    // Cleanup expired cache on update
    cleanupExpiredCache();
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[1nsyt] Message received:', message.action);

  if (message.action === 'get1nsyt') {
    handle1nsytRequest(message, sender, sendResponse);
    return true; // Keep message channel open for async response
  }

  if (message.action === 'clearCache') {
    handleClearCache(sendResponse);
    return true;
  }
});

/**
 * Handle 1nsyt request from content script
 */
async function handle1nsytRequest(message, sender, sendResponse) {
  try {
    const { profileUrl, profileData } = message;
    console.log('[1nsyt] Requesting 1nsyt for:', profileUrl);

    // Step 1 - Check cache first
    const cached = await getCached1nsyt(profileUrl);
    if (cached) {
      sendResponse({
        success: true,
        data: cached.result,
        cached: true,
        timestamp: cached.metadata.timestamp
      });
      return;
    }

    // TODO: Step 2 - Scrape in background tab if needed
    // const enrichedData = await scrapeProfileInBackground(profileUrl);

    // TODO: Step 3 - Call API
    // const response = await fetch('https://api.1nsyt.app/api/1nsyt', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(enrichedData)
    // });

    // Placeholder response for now (simulate API call)
    const placeholderResult = {
      summary: "This is a placeholder summary. The API integration is not yet implemented.",
      starters: [
        "Placeholder conversation starter 1",
        "Placeholder conversation starter 2",
        "Placeholder conversation starter 3"
      ]
    };

    // Step 4 - Cache the result
    await cache1nsyt(profileUrl, profileData, placeholderResult);

    sendResponse({
      success: true,
      data: placeholderResult,
      cached: false,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('[1nsyt] Error handling request:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

/**
 * Handle cache clearing request
 */
async function handleClearCache(sendResponse) {
  try {
    const count = await clearCache();
    console.log('[1nsyt] Cache cleared:', count, 'entries');
    sendResponse({ success: true, count });
  } catch (error) {
    console.error('[1nsyt] Error clearing cache:', error);
    sendResponse({ success: false, error: error.message });
  }
}
