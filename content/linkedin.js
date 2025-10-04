// content/linkedin.js - Content script for LinkedIn profile hover detection
// Runs on all LinkedIn pages

console.log('[1nsyt] Content script loaded on:', window.location.href);

// Configuration
const HOVER_DELAY = 300; // ms - debounce delay before triggering
let hoverTimeout = null;
let currentHoveredUrl = null;
let currentPopup = null; // Track current popup element
let currentTargetElement = null; // Track element being hovered

/**
 * Initialize hover detection
 */
function init() {
  console.log('[1nsyt] Initializing hover detection...');

  // Detect hovers on profile links
  document.addEventListener('mouseover', handleMouseOver);
  document.addEventListener('mouseout', handleMouseOut);

  console.log('[1nsyt] Hover detection ready');
}

/**
 * Handle mouse over event
 */
function handleMouseOver(event) {
  // Find closest profile link
  const profileLink = event.target.closest('a[href*="/in/"]');

  // Ignore if not a profile link or if it's a company link
  if (!profileLink || profileLink.href.includes('/company/')) {
    return;
  }

  const profileUrl = profileLink.href;

  // Ignore if already hovering same profile
  if (profileUrl === currentHoveredUrl) {
    return;
  }

  currentHoveredUrl = profileUrl;

  // Clear previous timeout
  clearTimeout(hoverTimeout);

  // Debounce: only trigger after sustained hover
  hoverTimeout = setTimeout(() => {
    console.log('[1nsyt] Sustained hover detected on:', profileUrl);
    handleProfileHover(profileLink, profileUrl);
  }, HOVER_DELAY);
}

/**
 * Handle mouse out event
 */
function handleMouseOut(event) {
  const profileLink = event.target.closest('a[href*="/in/"]');

  if (!profileLink) {
    return;
  }

  // Check if mouse is leaving to the popup itself
  const relatedTarget = event.relatedTarget;
  if (relatedTarget && currentPopup && currentPopup.contains(relatedTarget)) {
    return; // Don't close if moving to popup
  }

  // Clear timeout if user moves away quickly
  clearTimeout(hoverTimeout);
  currentHoveredUrl = null;

  // Hide popup after small delay
  setTimeout(() => {
    // Only hide if mouse is not over popup
    if (currentPopup && !currentPopup.matches(':hover')) {
      removeCurrentPopup();
      console.log('[1nsyt] Popup hidden');
    }
  }, 200);

  console.log('[1nsyt] Mouse left profile link');
}

/**
 * Handle profile hover - scrape basic data and request 1nsyt
 */
async function handleProfileHover(linkElement, profileUrl) {
  console.log('[1nsyt] Processing profile hover:', profileUrl);

  // Extract basic profile data from feed (instant)
  const profileData = extractBasicProfileData(linkElement);

  console.log('[1nsyt] Extracted profile data:', profileData);

  // Show loading state
  showLoadingPopup(linkElement, profileUrl);

  // Request 1nsyt from service worker
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'get1nsyt',
      profileUrl,
      profileData
    });

    console.log('[1nsyt] Received response:', response);

    if (response.success) {
      show1nsytPopup(linkElement, response.data, response.cached);
    } else {
      showErrorPopup(linkElement, response.error);
    }
  } catch (error) {
    console.error('[1nsyt] Error requesting 1nsyt:', error);

    // Special handling for extension context invalidated
    if (error.message.includes('Extension context invalidated')) {
      showErrorPopup(linkElement, 'Extension was reloaded. Please refresh this page (F5)');
    } else {
      showErrorPopup(linkElement, error.message);
    }
  }
}

/**
 * Extract basic profile data from LinkedIn feed DOM
 */
function extractBasicProfileData(linkElement) {
  // Try to extract name from link text or nearby elements
  const nameElement = linkElement.querySelector('span[dir="ltr"]') ||
                      linkElement.querySelector('.update-components-actor__title') ||
                      linkElement;

  const name = nameElement.textContent.trim();

  // Try to find title (job title) near the profile link
  const parentContainer = linkElement.closest('.update-components-actor') ||
                          linkElement.closest('.entity-result') ||
                          linkElement.closest('[class*="profile"]');

  let title = '';
  if (parentContainer) {
    const titleElement = parentContainer.querySelector('.update-components-actor__description') ||
                        parentContainer.querySelector('.entity-result__primary-subtitle') ||
                        parentContainer.querySelector('[class*="subline"]');

    title = titleElement ? titleElement.textContent.trim() : '';
  }

  return {
    name: name || 'Unknown',
    title: title || 'No title available',
    profileUrl: linkElement.href
  };
}

/**
 * Show loading popup
 */
function showLoadingPopup(linkElement, profileUrl) {
  console.log('[1nsyt] Showing loading popup for:', profileUrl);

  // Remove existing popup if any
  removeCurrentPopup();

  // Create popup element
  const popup = createPopupElement();
  currentPopup = popup;
  currentTargetElement = linkElement;

  // Set loading content
  popup.innerHTML = `
    <div class="insyt-popup-header">
      <div class="insyt-popup-logo">1NSYT</div>
    </div>
    <div class="insyt-loading">
      <div class="insyt-spinner"></div>
      <span>Getting the 1nsyt...</span>
    </div>
  `;

  // Position and show popup
  positionPopup(popup, linkElement);
  document.body.appendChild(popup);
}

/**
 * Show 1nsyt popup with data
 */
function show1nsytPopup(linkElement, data, cached) {
  console.log('[1nsyt] Showing 1nsyt popup:', data);
  console.log('[1nsyt] Data was cached:', cached);

  // Update existing popup or create new one
  if (!currentPopup) {
    const popup = createPopupElement();
    currentPopup = popup;
    currentTargetElement = linkElement;
    document.body.appendChild(popup);
    positionPopup(popup, linkElement);
  }

  // Build conversation starters HTML
  const startersHTML = data.starters
    .map(starter => `
      <div class="insyt-starter-item" title="Click to copy">
        ${escapeHtml(starter)}
      </div>
    `)
    .join('');

  // Update popup content
  currentPopup.innerHTML = `
    <div class="insyt-popup-header">
      <div class="insyt-popup-logo">1NSYT</div>
      ${cached ? '<span class="insyt-cached-badge">Cached</span>' : ''}
    </div>
    <div class="insyt-summary">
      ${escapeHtml(data.summary)}
    </div>
    <div class="insyt-starters-title">💬 Conversation Starters</div>
    ${startersHTML}
  `;

  // Add click-to-copy functionality
  currentPopup.querySelectorAll('.insyt-starter-item').forEach((item, index) => {
    item.addEventListener('click', () => {
      navigator.clipboard.writeText(data.starters[index]);
      item.style.background = '#10B981';
      item.style.color = 'white';
      item.textContent = '✓ Copied!';
      setTimeout(() => {
        item.style.background = '';
        item.style.color = '';
        item.textContent = data.starters[index];
      }, 1500);
    });
  });
}

/**
 * Show error popup
 */
function showErrorPopup(linkElement, errorMessage) {
  console.error('[1nsyt] Showing error popup:', errorMessage);

  // Update existing popup or create new one
  if (!currentPopup) {
    const popup = createPopupElement();
    currentPopup = popup;
    currentTargetElement = linkElement;
    document.body.appendChild(popup);
    positionPopup(popup, linkElement);
  }

  // Update popup content with error
  currentPopup.innerHTML = `
    <div class="insyt-popup-header">
      <div class="insyt-popup-logo">1NSYT</div>
    </div>
    <div class="insyt-error">
      ⚠️ Error: ${escapeHtml(errorMessage)}
    </div>
  `;
}

/**
 * Create popup DOM element
 */
function createPopupElement() {
  const popup = document.createElement('div');
  popup.className = 'insyt-popup';
  popup.id = 'insyt-popup-' + Date.now();

  // Add mouseleave listener to close popup when mouse leaves
  popup.addEventListener('mouseleave', () => {
    setTimeout(() => {
      if (popup && !popup.matches(':hover')) {
        removeCurrentPopup();
        console.log('[1nsyt] Popup closed on mouseleave');
      }
    }, 300);
  });

  return popup;
}

/**
 * Position popup near target element
 */
function positionPopup(popup, targetElement) {
  const rect = targetElement.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  // Position below and to the right of the link
  let top = rect.bottom + scrollTop + 8;
  let left = rect.left + scrollLeft;

  // Adjust if popup would go off-screen
  const popupWidth = 320; // From CSS
  const popupHeight = 400; // Estimated max height

  if (left + popupWidth > window.innerWidth + scrollLeft) {
    left = window.innerWidth + scrollLeft - popupWidth - 16;
  }

  if (top + popupHeight > window.innerHeight + scrollTop) {
    top = rect.top + scrollTop - popupHeight - 8;
  }

  popup.style.top = `${top}px`;
  popup.style.left = `${left}px`;
}

/**
 * Remove current popup
 */
function removeCurrentPopup() {
  if (currentPopup && currentPopup.parentNode) {
    currentPopup.parentNode.removeChild(currentPopup);
  }
  currentPopup = null;
  currentTargetElement = null;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
