// utils/storage.js - Chrome Storage helper functions for caching 1nsyts

const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const CACHE_PREFIX = '1nsyt:';

/**
 * Save 1nsyt to cache
 * @param {string} profileUrl - LinkedIn profile URL
 * @param {object} profileData - Scraped profile data (name, title, location)
 * @param {object} result - Mistral AI result (summary + starters)
 * @returns {Promise<void>}
 */
export async function cache1nsyt(profileUrl, profileData, result) {
  const cacheKey = `${CACHE_PREFIX}${profileUrl}`;
  const now = Date.now();

  const cached1nsyt = {
    profileData,
    result,
    metadata: {
      cached: true,
      timestamp: now,
      expiresAt: now + CACHE_TTL,
      version: chrome.runtime.getManifest().version
    }
  };

  await chrome.storage.local.set({ [cacheKey]: cached1nsyt });
  console.log(`[Cache] Saved 1nsyt for ${profileUrl}`);
}

/**
 * Get 1nsyt from cache
 * @param {string} profileUrl - LinkedIn profile URL
 * @returns {Promise<object|null>} Cached 1nsyt or null if not found/expired
 */
export async function getCached1nsyt(profileUrl) {
  const cacheKey = `${CACHE_PREFIX}${profileUrl}`;
  const data = await chrome.storage.local.get(cacheKey);
  const cached = data[cacheKey];

  if (!cached) {
    console.log(`[Cache] Miss: ${profileUrl}`);
    return null;
  }

  // Check expiration
  if (Date.now() > cached.metadata.expiresAt) {
    console.log(`[Cache] Expired: ${profileUrl}`);
    await chrome.storage.local.remove(cacheKey);
    return null;
  }

  console.log(`[Cache] Hit: ${profileUrl}`);
  return cached;
}

/**
 * Clear all cached 1nsyts
 * @returns {Promise<number>} Number of entries removed
 */
export async function clearCache() {
  const allData = await chrome.storage.local.get();
  const cacheKeys = Object.keys(allData).filter(key => key.startsWith(CACHE_PREFIX));

  await chrome.storage.local.remove(cacheKeys);
  console.log(`[Cache] Cleared ${cacheKeys.length} cached 1nsyts`);

  return cacheKeys.length;
}

/**
 * Get cache statistics
 * @returns {Promise<object>} Cache stats (count, size, oldest, newest)
 */
export async function getCacheStats() {
  const allData = await chrome.storage.local.get();
  const cacheEntries = Object.entries(allData)
    .filter(([key]) => key.startsWith(CACHE_PREFIX))
    .map(([key, value]) => ({ key, ...value }));

  if (cacheEntries.length === 0) {
    return {
      count: 0,
      estimatedSize: 0,
      oldest: null,
      newest: null
    };
  }

  const timestamps = cacheEntries.map(e => e.metadata.timestamp);
  const estimatedSize = JSON.stringify(allData).length;

  return {
    count: cacheEntries.length,
    estimatedSize, // bytes
    oldest: new Date(Math.min(...timestamps)),
    newest: new Date(Math.max(...timestamps))
  };
}

/**
 * Cleanup expired cache entries (run periodically)
 * @returns {Promise<number>} Number of expired entries removed
 */
export async function cleanupExpiredCache() {
  const allData = await chrome.storage.local.get();
  const now = Date.now();
  const expiredKeys = [];

  for (const [key, value] of Object.entries(allData)) {
    if (key.startsWith(CACHE_PREFIX) && value.metadata?.expiresAt < now) {
      expiredKeys.push(key);
    }
  }

  if (expiredKeys.length > 0) {
    await chrome.storage.local.remove(expiredKeys);
    console.log(`[Cache] Cleaned up ${expiredKeys.length} expired entries`);
  }

  return expiredKeys.length;
}

/**
 * Invalidate a specific cached 1nsyt
 * @param {string} profileUrl - LinkedIn profile URL
 * @returns {Promise<void>}
 */
export async function invalidate1nsyt(profileUrl) {
  const cacheKey = `${CACHE_PREFIX}${profileUrl}`;
  await chrome.storage.local.remove(cacheKey);
  console.log(`[Cache] Invalidated: ${profileUrl}`);
}
