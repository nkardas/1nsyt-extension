// background/service-worker.js - Background service worker for 1nsyt
// Manifest V3 architecture: event-driven, not persistent

import { cache1nsyt, getCached1nsyt, clearCache, cleanupExpiredCache } from '../utils/storage.js';
import { generate1nsyt } from '../utils/api.js';
import { scrapeProfileInBackground } from '../utils/background-tab-manager.js';

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

    // Step 2 - Scrape in background tab for enriched data
    console.log('[1nsyt] Enriching data via background tab...');
    let enrichedData = profileData;

    try {
      const scrapedData = await scrapeProfileInBackground(profileUrl);

      // Merge scraped data with basic feed data
      enrichedData = {
        name: scrapedData.name || profileData.name,
        title: scrapedData.title || profileData.title,
        location: scrapedData.location || null,
        company: scrapedData.company || null,
        profileUrl: profileUrl
      };

      console.log('[1nsyt] Enriched data:', enrichedData);
    } catch (error) {
      console.warn('[1nsyt] Background scraping failed, using basic data:', error.message);
      // Continue with basic data if scraping fails
    }

    // Step 3 - Call Mistral AI API with enriched data
    console.log('[1nsyt] Calling Mistral AI API...');
    const apiResponse = await generate1nsyt(enrichedData);

    if (!apiResponse.success) {
      throw new Error(apiResponse.error);
    }

    const result = apiResponse.data;

    // Step 4 - Cache the result with enriched data
    await cache1nsyt(profileUrl, enrichedData, result);

    sendResponse({
      success: true,
      data: result,
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
