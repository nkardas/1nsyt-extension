# 👁 Insyt Logo Assets

> Insyt logo files in various formats and sizes

## 📁 Files in This Directory

### Wordmark (Full Logo with Text)

**Monochrome Light Mode:**
- `insyt-wordmark-light.svg` - Black text with eye dot on i
- Usage: Light backgrounds, marketing, docs

**Monochrome Dark Mode:**
- `insyt-wordmark-dark.svg` - White text with eye dot on i
- Usage: Dark backgrounds, dark mode UI

**Blue Version:**
- `insyt-wordmark-blue.svg` - LinkedIn Blue text with blue eye dot
- Usage: LinkedIn integration, professional branding

**Orange Version:**
- `insyt-wordmark-orange.svg` - Orange text with orange eye dot
- Usage: Energy, contrast, alternative branding

### Icon Only (Single Eye)

**Monochrome:**
- `eye-icon.svg` - Single black/white eye
- Usage: Favicons, small spaces, monochrome contexts

**Blue:**
- `eye-icon-blue.svg` - LinkedIn Blue eye
- Usage: LinkedIn integration

**Orange:**
- `eye-icon-orange.svg` - Orange eye
- Usage: Alternative branding

### Extension Icons

**Chrome Extension:**
- `icon-128.svg` - 128x128 circular icon with centered eye
- Usage: Chrome extension listing, browser toolbar

---

## 🎨 Design Specs

### Wordmark

**Typography:**
- Font: Poppins ExtraBold (800)
- Letter-spacing: -3px (tight, letters almost touching)
- Letters: ı n s y t
- Eye: Small round eye as dot on the "ı" (i without dot)

**Eye Design:**
- Round eye (circle, not ellipse)
- Radius: 5px
- Positioned as the dot above the dotless i (ı)
- Contains: white, pupil, highlight

**Colors - Monochrome Light:**
- Letters: #000000 (Black)
- Eye stroke: #000000
- Eye white: #FFFFFF
- Eye pupil: #000000

**Colors - Monochrome Dark:**
- Letters: #FFFFFF (White)
- Eye stroke: #FFFFFF
- Eye white: #FFFFFF
- Eye pupil: #000000

**Colors - Blue:**
- Letters: #0077B5 (LinkedIn Blue)
- Eye stroke: #0077B5
- Eye white: #FFFFFF
- Eye pupil: #0077B5

**Colors - Orange:**
- Letters: #FF6B35 (Orange)
- Eye stroke: #FF6B35
- Eye white: #FFFFFF
- Eye pupil: #FF6B35

### Icon (Single Eye)

**Anatomy:**
- Large vertical oval eye
- Components:
  - Outer ellipse (colored stroke)
  - White fill
  - Black/colored pupil (ellipse)
  - Small highlight dot (makes it look alive)

**Sizing:**
- Standard: 40x60px (vertical orientation)
- Extension: 128x128px (centered on circular background)

---

## 🖼️ Usage Guidelines

### When to Use Wordmark vs Icon

**Use Wordmark (insyt) when:**
- ✅ You have horizontal space (150px+ width)
- ✅ Primary branding moment (landing page header)
- ✅ Marketing materials
- ✅ Documentation homepage

**Use Icon (👁 only) when:**
- ✅ Limited space (toolbar, favicon)
- ✅ Already established context (user knows it's Insyt)
- ✅ App icons, browser extensions
- ✅ Social media profile pictures

### Color Mode Selection

**Monochrome (Light/Dark):**
- Use for: Maximum compatibility, professional contexts
- Adapts to light/dark backgrounds

**Blue Version:**
- Use for: LinkedIn integration, professional tech branding
- Maintains LinkedIn aesthetic

**Orange Version:**
- Use for: Energy, contrast, standing out
- Alternative branding moments

---

## 📐 Sizes & Formats

### Current Files (SVG)

All files are vector SVG for infinite scalability.

**Advantages:**
- ✅ Scale to any size without quality loss
- ✅ Small file size
- ✅ Editable in code or vector editors
- ✅ CSS/color customizable

### Needed Conversions (PNG)

**For Chrome Extension:**
- [ ] icon-16.png (16x16px)
- [ ] icon-48.png (48x48px)
- [ ] icon-128.png (128x128px)

**For Marketing:**
- [ ] wordmark-light-1000.png (1000px width)
- [ ] wordmark-blue-1000.png (1000px width)
- [ ] icon-512.png (512x512px for high-res)

**Tools to convert SVG → PNG:**
- Online: https://svgtopng.com/
- Command line: `rsvg-convert` or ImageMagick
- Design tool: Figma, Illustrator (export PNG)

---

## ✏️ Editing the Logos

### SVG Code Structure

Files are standard SVG XML. You can:
- Edit colors by changing `fill="#0077B5"` values
- Adjust sizes in `viewBox` attribute
- Modify eye shapes (circle/ellipse radius values)
- Change fonts (currently Poppins ExtraBold)

### Design Software

**Open and edit in:**
- Figma (free, browser-based)
- Adobe Illustrator
- Inkscape (free, open-source)
- VS Code (for code-level edits)

**Tips:**
- Fonts: Install Poppins before opening
- The "i" uses dotless ı (U+0131) character
- Eye is positioned manually as SVG group
- Maintain tight letter-spacing (-3px)

---

## 🎯 Brand Consistency

### Do's ✅

- Use provided color values exactly
- Maintain -3px letter-spacing on wordmark
- Keep eye round and proportional
- Use appropriate color version for context
- Keep the eye as the dot on the "i"

### Don'ts ❌

- Don't change the font (must be Poppins ExtraBold)
- Don't stretch or skew the logo
- Don't separate letters (must remain tight)
- Don't make the eye too large or too small
- Don't add drop shadows or gradients (keep it clean)
- Don't use regular "i" instead of dotless "ı"

---

## 📋 File Naming Convention

```
[name]-[variant]-[mode].[ext]

Examples:
- insyt-wordmark-light.svg
- insyt-wordmark-dark.svg
- insyt-wordmark-blue.svg
- insyt-wordmark-orange.svg
- eye-icon.svg
- eye-icon-blue.svg
- icon-128.svg
```

**Naming parts:**
- `insyt` = project name
- `wordmark` / `icon` / `eye` = logo type
- `light` / `dark` / `blue` / `orange` = color variant
- `128` = size (for fixed-size assets)
- `.svg` / `.png` = file format

---

## 🔗 Related Documentation

- [Logo Concepts](../../../docs/docs/07-branding/logo.md)
- [Color Palette](../../../docs/docs/07-branding/colors.md)
- [Typography Guide](../../../docs/docs/07-branding/typography.md)

---

## 📦 Asset Checklist

### SVG Files (✅ Created)

- [x] insyt-wordmark-light.svg
- [x] insyt-wordmark-dark.svg
- [x] insyt-wordmark-blue.svg
- [x] insyt-wordmark-orange.svg
- [x] eye-icon.svg
- [x] eye-icon-blue.svg
- [x] eye-icon-orange.svg
- [x] icon-128.svg

### PNG Files (⏳ To Generate)

**Extension:**
- [ ] icon-16.png
- [ ] icon-48.png
- [ ] icon-128.png

**Marketing:**
- [ ] wordmark-light-1000.png
- [ ] wordmark-blue-1000.png
- [ ] icon-512.png

### Favicon

- [ ] favicon.ico (multi-size)
- [ ] favicon-16x16.png
- [ ] favicon-32x32.png
- [ ] apple-touch-icon.png (180x180)

---

**Created with 👁 for Insyt.dev**
