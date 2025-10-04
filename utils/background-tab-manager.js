// utils/background-tab-manager.js - Background tab scraping for LinkedIn profiles

/**
 * Scrape LinkedIn profile in background tab
 * Opens profile in hidden tab, scrapes enriched data, then closes tab
 *
 * @param {string} profileUrl - Full LinkedIn profile URL
 * @returns {Promise<object>} Enriched profile data
 */
export async function scrapeProfileInBackground(profileUrl) {
  return new Promise((resolve, reject) => {
    console.log('[Background Tab] Opening profile:', profileUrl);

    // Step 1: Open background tab (hidden from user)
    chrome.tabs.create({
      url: profileUrl,
      active: false // Don't switch to this tab
    }, async (tab) => {
      try {
        // Step 2: Wait for page to fully load
        await waitForTabLoad(tab.id);

        console.log('[Background Tab] Page loaded, scraping data...');

        // Step 3: Inject scraping script into the tab
        const [result] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: extractProfileData
        });

        // Step 4: Close tab immediately
        chrome.tabs.remove(tab.id);

        // Step 5: Return scraped data
        if (result && result.result) {
          console.log('[Background Tab] Success:', result.result);
          resolve(result.result);
        } else {
          reject(new Error('Failed to extract profile data'));
        }

      } catch (error) {
        // Clean up tab on error
        chrome.tabs.remove(tab.id);
        reject(error);
      }
    });
  });
}

/**
 * Wait for tab to finish loading
 * @param {number} tabId - Chrome tab ID
 * @param {number} timeout - Max wait time in ms (default 10s)
 * @returns {Promise<void>}
 */
function waitForTabLoad(tabId, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const listener = (updatedTabId, changeInfo) => {
      if (updatedTabId === tabId && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        clearTimeout(timeoutId);

        // Add small delay to ensure DOM is ready
        setTimeout(resolve, 500);
      }
    };

    const timeoutId = setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      reject(new Error('Tab load timeout'));
    }, timeout);

    chrome.tabs.onUpdated.addListener(listener);
  });
}

/**
 * Extract profile data from LinkedIn page (runs in tab context)
 * This function is injected into the LinkedIn profile page
 *
 * @returns {object} Scraped profile data
 */
function extractProfileData() {
  try {
    console.log('[Scraper] Extracting profile data from:', window.location.href);

    // Check if redirected to login page
    if (window.location.href.includes('/login') || window.location.href.includes('/uas/login')) {
      return {
        error: 'USER_NOT_LOGGED_IN',
        message: 'Please log in to LinkedIn to use 1nsyt'
      };
    }

    // LinkedIn profile page selectors (validated in spike)
    const name = document.querySelector('.mt2.relative h1')?.textContent.trim() ||
                 document.querySelector('h1')?.textContent.trim() ||
                 '';

    const title = document.querySelector('.text-body-medium')?.textContent.trim() ||
                  document.querySelector('.pv-text-details__left-panel div')?.textContent.trim() ||
                  '';

    const location = document.querySelector('.text-body-small.inline.t-black--light.break-words')?.textContent.trim() ||
                     document.querySelector('.pv-text-details__left-panel .text-body-small')?.textContent.trim() ||
                     '';

    // Try to extract current company
    const companyElement = document.querySelector('[data-field="experience_company_logo"] img')?.alt ||
                          document.querySelector('.pv-top-card--experience-list-item')?.textContent.trim() ||
                          '';

    // Fallback to meta tags if selectors fail
    const nameFallback = document.querySelector('meta[property="og:title"]')?.content || name;
    const titleFallback = document.querySelector('meta[property="og:description"]')?.content || title;

    const result = {
      name: name || nameFallback || 'Unknown',
      title: title || titleFallback || 'No title available',
      location: location || null,
      company: companyElement || null,
      profileUrl: window.location.href,
      scrapedAt: Date.now()
    };

    console.log('[Scraper] Extracted data:', result);

    return result;

  } catch (error) {
    console.error('[Scraper] Error extracting profile data:', error);
    return {
      name: '',
      title: '',
      location: '',
      company: '',
      profileUrl: window.location.href,
      error: error.message
    };
  }
}

/**
 * Scrape multiple profiles concurrently (with rate limiting)
 * @param {string[]} profileUrls - Array of profile URLs
 * @param {number} concurrency - Max parallel tabs (default: 2)
 * @returns {Promise<object[]>} Array of scraped profile data
 */
export async function scrapeMultipleProfiles(profileUrls, concurrency = 2) {
  const results = [];
  const queue = [...profileUrls];

  async function processNext() {
    if (queue.length === 0) return;

    const url = queue.shift();
    try {
      const data = await scrapeProfileInBackground(url);
      results.push({ url, success: true, data });
    } catch (error) {
      results.push({ url, success: false, error: error.message });
    }

    // Process next in queue
    await processNext();
  }

  // Start concurrent workers
  const workers = Array(Math.min(concurrency, queue.length))
    .fill(null)
    .map(() => processNext());

  await Promise.all(workers);
  return results;
}
