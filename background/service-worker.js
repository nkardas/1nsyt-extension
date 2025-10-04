// background/service-worker.js - Background service worker for 1nsyt
// Manifest V3 architecture: event-driven, not persistent

console.log('[1nsyt] Service worker initialized');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[1nsyt] Extension installed:', details.reason);

  if (details.reason === 'install') {
    console.log('[1nsyt] First install - Welcome!');
    // TODO: Show onboarding popup
  } else if (details.reason === 'update') {
    console.log('[1nsyt] Extension updated to version:', chrome.runtime.getManifest().version);
    // TODO: Clear old cache if version mismatch
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

    // TODO: Step 1 - Check cache first
    // const cached = await getCached1nsyt(profileUrl);
    // if (cached) {
    //   sendResponse({ success: true, data: cached.result, cached: true });
    //   return;
    // }

    // TODO: Step 2 - Scrape in background tab if needed
    // const enrichedData = await scrapeProfileInBackground(profileUrl);

    // TODO: Step 3 - Call API
    // const response = await fetch('https://api.1nsyt.app/api/1nsyt', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(enrichedData)
    // });

    // TODO: Step 4 - Cache result
    // await cache1nsyt(profileUrl, enrichedData, result.data);

    // Placeholder response for now
    sendResponse({
      success: true,
      data: {
        summary: "This is a placeholder summary. The API integration is not yet implemented.",
        starters: [
          "Placeholder conversation starter 1",
          "Placeholder conversation starter 2",
          "Placeholder conversation starter 3"
        ]
      },
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
    // TODO: Implement cache clearing
    // await clearCache();
    console.log('[1nsyt] Cache cleared');
    sendResponse({ success: true });
  } catch (error) {
    console.error('[1nsyt] Error clearing cache:', error);
    sendResponse({ success: false, error: error.message });
  }
}
