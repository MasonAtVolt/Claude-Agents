# Volt Technologies Logo Assets

Official logo files for Volt Technologies branding.

---

## Logo Files

| File | Description | Usage |
|------|-------------|-------|
| `volt-logo-full.png` | Full horizontal lockup with text | Primary logo for documents, headers, presentations |
| `volt-logo-mark.png` | Lightning bolt icon only | Favicons, small spaces, app icons, watermarks |

---

## Logo Anatomy

### Full Logo (Horizontal Lockup)
```
[Lightning Bolt Icon] VOLT
                      TECHNOLOGIES
```
- **Icon**: Stylized lightning bolt with yellow-to-orange gradient
- **"VOLT"**: Bold black uppercase text
- **"TECHNOLOGIES"**: Black uppercase text, lighter weight, below "VOLT"

### Logo Mark (Icon Only)
- Stylized lightning bolt forming a "V" shape
- Gradient from yellow (#FFD93D) at top to orange (#F4A020) at bottom
- Curved inner element suggesting energy/motion

---

## Logo Colors

| Element | Color | Hex |
|---------|-------|-----|
| Bolt Top | Yellow | `#FFD93D` |
| Bolt Bottom | Orange | `#F4A020` |
| Text | Black | `#000000` |

### On Dark Backgrounds
- Use white text version when placing on black/dark backgrounds
- Lightning bolt gradient remains the same

---

## Clear Space

Maintain minimum clear space around the logo equal to the height of the "V" in VOLT.

```
    ┌─────────────────────────┐
    │                         │
    │   [LOGO]                │
    │                         │
    └─────────────────────────┘
         ↑ minimum padding
```

---

## Minimum Sizes

| Version | Minimum Width |
|---------|---------------|
| Full Logo | 150px |
| Logo Mark | 32px |

---

## Usage in Documents

### HTML/CSS Reference
```html
<!-- Full Logo -->
<img src="assets/logos/volt-logo-full.png" alt="Volt Technologies" class="logo-full">

<!-- Logo Mark Only -->
<img src="assets/logos/volt-logo-mark.png" alt="Volt" class="logo-mark">
```

### Placement Guidelines
- **Presentations**: Title slide (centered or bottom-right)
- **Documents**: Header (top-left) or footer (bottom-center)
- **Reports**: Cover page and footer

---

## Don'ts

- ✗ Don't rotate the logo
- ✗ Don't stretch or distort proportions
- ✗ Don't change the gradient colors
- ✗ Don't add effects (shadows, glows, outlines)
- ✗ Don't place on busy backgrounds without sufficient contrast
- ✗ Don't recreate or approximate the logo

---

## File Locations

```
assets/
└── logos/
    ├── volt-logo-full.png      # Full horizontal lockup
    ├── volt-logo-mark.png      # Icon/mark only
    ├── volt-logo-full-white.png # White text version (dark backgrounds)
    └── README.md               # This file
```
