# 👁️ 1nsyt Extension

> Get the 1nsyt before you meet - AI-powered LinkedIn insights on hover

Chrome extension that provides instant AI-powered summaries and conversation starters when you hover over LinkedIn profiles.

## 🚀 Quick Start (Development)

### Prerequisites

- Chrome browser
- Node.js 20+
- Icons generated (see `assets/icons/README.md`)

### Load Extension in Chrome

1. Clone this repository
2. Generate PNG icons (see `assets/icons/README.md`)
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" (toggle in top-right)
5. Click "Load unpacked"
6. Select the `1nsyt-extension/` folder

### Test on LinkedIn

1. Go to https://www.linkedin.com/feed/
2. Open DevTools Console (F12)
3. Hover over profile links
4. Watch console logs for hover detection
5. Popup will appear (implementation in progress)

## 📁 Project Structure

```
1nsyt-extension/
├── manifest.json           # Extension configuration (Manifest V3)
├── background/
│   └── service-worker.js   # Background worker (API calls, cache)
├── content/
│   ├── linkedin.js         # LinkedIn hover detection
│   └── styles.css          # Popup styles
├── popup/
│   ├── popup.html          # Extension popup UI
│   ├── popup.css           # Popup styles
│   └── popup.js            # Popup logic
├── utils/                  # Utility modules (future)
└── assets/
    └── icons/              # Extension icons

```

## 🛠️ Current Status

**v1 MVP - In Development**

- ✅ Manifest V3 configuration
- ✅ Service worker skeleton
- ✅ Content script with hover detection
- ✅ Popup UI
- ⏳ Chrome Storage cache implementation
- ⏳ Background tab scraping
- ⏳ API integration (Mistral AI)
- ⏳ Actual popup display on hover

## 🔧 Development Commands

```bash
# Install dependencies (Husky + Commitlint)
npm install

# Commits must follow conventional format
git commit -m "feat(content): add hover detection"
```

## 📝 Commit Convention

All commits are enforced via Husky + Commitlint:

```
type(scope): description

Examples:
feat(content): add hover detection on profile links
fix(popup): correct alignment of conversation starters
docs(readme): update installation instructions
```

## 🔗 Related Repositories

- [Backend API](https://github.com/nkardas/1nsyt-backend) (Private)
- [Documentation](https://github.com/nkardas/1nsyt-docs) (Private)

## 📚 Documentation

Complete technical documentation available in the `1nsyt-docs` repository.

## 🤝 Contributing

See [CONTRIBUTING.md](../1nsyt-docs/docs/docs/08-development/contributing.md)

## 📄 License

MIT

---

Built with 👁️ by nKardas • 2025
