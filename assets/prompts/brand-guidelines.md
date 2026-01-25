# Brand Guidelines

Core aesthetic principles for all agent-generated content and visual outputs.

---

## Brand Philosophy

Our visual identity is rooted in **technical precision** and **minimalist elegance**. Inspired by circuit board architecture, we embrace clean lines, structured layouts, and purposeful design. Every element should feel intentional, modern, and sophisticated.

---

## Color Palette

### Primary Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Black** | `#000000` | Primary backgrounds, text on light surfaces |
| **White** | `#FFFFFF` | Primary text, content areas, contrast elements |

### Accent Color

| Color | Hex | Usage |
|-------|-----|-------|
| **Gold** | `#D4AF37` | Highlights, accents, interactive elements, emphasis |
| **Light Gold** | `#F4CF67` | Gradients, hover states, secondary accents |

### Extended Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Dark Gray** | `#0D0D0D` | Subtle backgrounds, code blocks |
| **Medium Gray** | `#1A1A1A` | Cards, elevated surfaces |
| **Light Gray** | `#2A2A2A` | Borders, dividers |
| **Muted White** | `rgba(255,255,255,0.8)` | Secondary text |
| **Subtle White** | `rgba(255,255,255,0.4)` | Tertiary text, metadata |

---

## Design Principles

### 1. Minimalism First
- Remove unnecessary elements
- Embrace negative space
- Every element must serve a purpose
- When in doubt, leave it out

### 2. Circuit Board Aesthetic
- Clean, geometric lines
- Grid-based layouts
- Connection patterns (lines, nodes, pathways)
- Technical precision in alignment and spacing

### 3. High Contrast
- Black backgrounds with white text as default
- Gold accents for emphasis and interactivity
- Avoid muddy mid-tones
- Maintain strong visual hierarchy

### 4. Structured Hierarchy
- Clear visual levels (primary, secondary, tertiary)
- Consistent spacing ratios
- Logical content flow
- Predictable element placement

---

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

### Monospace (Code)
```css
font-family: 'SF Mono', 'Fira Code', 'Consolas', 'Monaco', monospace;
```

### Type Scale

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Display/Hero | 4-5rem | 700 | White |
| Heading 1 | 3rem | 600 | White |
| Heading 2 | 2.5rem | 600 | White |
| Heading 3 | 1.75rem | 600 | White |
| Body | 1.125-1.25rem | 400 | White/Muted White |
| Caption | 0.875rem | 400 | Subtle White |
| Code | 1rem | 400 | White with Gold border |

### Typography Rules
- Use sentence case for headings (not ALL CAPS except for section dividers)
- Maintain generous line height (1.6 for body text)
- Left-align text by default
- Center only for hero/title sections

---

## Visual Elements

### Dividers & Borders
- Use gold (`#D4AF37`) for accent dividers
- Thin borders: `1px solid rgba(255,255,255,0.1)`
- Accent borders: `1px solid #D4AF37` or `3px solid #D4AF37`
- Gradient dividers: `linear-gradient(90deg, transparent, #D4AF37, transparent)`

### Accent Lines
Inspired by circuit traces:
```css
/* Horizontal accent under headings */
border-bottom: 3px solid #D4AF37;

/* Gradient accent line */
background: linear-gradient(90deg, #D4AF37, #F4CF67);
height: 3-4px;
```

### Bullet Points
- Use gold circular bullets
- Size: 8-10px diameter
- Alternatively: gold dashes or circuit-node style squares

### Code Blocks
```css
background-color: #0D0D0D;
border: 1px solid #D4AF37;
border-radius: 8px;
padding: 1.5-2rem;
```

### Cards & Containers
```css
background-color: #1A1A1A;
border: 1px solid rgba(255,255,255,0.1);
border-radius: 4-8px;
```

---

## Spacing System

Use a consistent spacing scale based on 8px units:

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight internal spacing |
| `sm` | 8px | Related elements |
| `md` | 16px | Standard spacing |
| `lg` | 24px | Section spacing |
| `xl` | 32px | Major sections |
| `2xl` | 48px | Page sections |
| `3xl` | 64px | Hero areas |

---

## Motion & Animation

### Principles
- Subtle and purposeful
- Never distracting
- Enhance understanding, don't decorate

### Timing
- Fast: `0.2s` - Hover states, micro-interactions
- Medium: `0.3s` - Transitions, reveals
- Slow: `0.5s` - Page transitions, major reveals

### Easing
```css
/* Standard easing */
transition: all 0.3s ease;

/* Smooth entrance */
transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
```

### Common Animations
```css
/* Fade in with slight rise */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

---

## Component Patterns

### Buttons (when needed)
```css
/* Primary button */
background: transparent;
border: 2px solid #D4AF37;
color: #D4AF37;
padding: 12px 24px;
border-radius: 4px;

/* Hover state */
background: #D4AF37;
color: #000000;
```

### Progress Indicators
```css
/* Track */
background: rgba(255,255,255,0.1);
height: 3-4px;

/* Fill */
background: linear-gradient(90deg, #D4AF37, #F4CF67);
```

### Interactive Elements
- Gold color for interactive/clickable elements
- Subtle hover transitions
- Clear focus states for accessibility

---

## Iconography

### Style
- Line icons preferred (not filled)
- Stroke width: 1.5-2px
- Geometric and minimal
- White or gold color only

### Size Scale
- Small: 16px
- Medium: 20-24px
- Large: 32px

---

## Image Treatment

### Photography
- High contrast black and white preferred
- If color, desaturate and increase contrast
- Gold overlay or accent for branded images

### Illustrations
- Line art style
- Circuit board / technical aesthetic
- Black, white, and gold only
- Geometric patterns

### Borders on Media
```css
border: 2px solid #D4AF37;
border-radius: 4px;
```

---

## Responsive Considerations

### Breakpoints
- Mobile: < 480px
- Tablet: 481px - 768px
- Desktop: 769px - 1024px
- Large: > 1024px

### Scaling
- Reduce font sizes proportionally on smaller screens
- Maintain spacing ratios
- Stack layouts vertically on mobile
- Preserve visual hierarchy at all sizes

---

## Accessibility

### Contrast Requirements
- Primary text on black: White (#FFFFFF) - Ratio 21:1 ✓
- Gold on black: #D4AF37 - Ratio 8.5:1 ✓
- Muted text: rgba(255,255,255,0.8) - Maintain 4.5:1 minimum

### Focus States
- Clear visible focus indicators
- Use gold outline for focus: `outline: 2px solid #D4AF37`
- Never remove focus indicators

### Motion
- Respect `prefers-reduced-motion`
- Provide static alternatives when needed

---

## Don'ts

- ✗ Don't use colors outside the defined palette
- ✗ Don't use decorative elements without purpose
- ✗ Don't overcrowd layouts
- ✗ Don't use low contrast text
- ✗ Don't use rounded/bubbly aesthetics
- ✗ Don't use gradients except gold accent gradients
- ✗ Don't use shadows heavily (if at all, keep very subtle)
- ✗ Don't use emojis unless explicitly requested

---

## Quick Reference

```
COLORS:
  Black:      #000000
  White:      #FFFFFF
  Gold:       #D4AF37
  Light Gold: #F4CF67

FONTS:
  Body: System sans-serif stack
  Code: SF Mono, Fira Code, Consolas

SPACING:
  Base unit: 8px
  Scale: 4, 8, 16, 24, 32, 48, 64

TRANSITIONS:
  Default: 0.3s ease
  Smooth:  0.5s cubic-bezier(0.4, 0, 0.2, 1)

AESTHETIC:
  Circuit board + Minimalism + High Contrast
```
