# 1nsyt Icons

## Temporary Solution

For testing purposes, you need to generate PNG icons from the SVG file.

### Generate Icons

Use an online tool or ImageMagick to convert `icon.svg` to PNG:

```bash
# Using ImageMagick (if installed)
convert -background none icon.svg -resize 16x16 icon-16.png
convert -background none icon.svg -resize 48x48 icon-48.png
convert -background none icon.svg -resize 128x128 icon-128.png
```

### Online Alternative

1. Open https://www.iloveimg.com/resize-image/resize-svg
2. Upload `icon.svg`
3. Export as PNG at 16x16, 48x48, and 128x128

### Required Files

- `icon-16.png` - Toolbar icon
- `icon-48.png` - Extension management page
- `icon-128.png` - Chrome Web Store listing

## Production Icons

For production, we'll create custom designed icons following the brand guidelines in the documentation.
