---
name: Precision Medical
colors:
  primary: "#262323"
  secondary: "#FFFFFF"
  accent: "#F55F24"
  background: "#F9F9F9"
  cardWrapper: "rgba(38,35,35,0.04)"
  border: "rgba(38,35,35,0.08)"
---

# Design System: Precision Medical

## 1. Visual Theme & Atmosphere
The website follows a high-precision, premium visual language resembling a Swiss design layout. It uses generous margins, strong geometric grids, and high-contrast styling. Neutral backgrounds are warm off-whites, and the text elements are dark charcoal black. Deep Coral/Orange is used selectively as an accent to indicate interactivity and critical actions.

The overall atmosphere feels clinical, cutting-edge, and highly scientific, yet premium and clean. There are zero rounded shapes except for pill-buttons and circular avatar stacks. Layout containers are flat, using hairline borders or very subtle translucent backgrounds rather than heavy drop shadows.

## 2. Color Palette & Roles
### Primary Foundation
- **Background (`--color-bg`):** `#F9F9F9` — Warm off-white, light gray. Used for main body background.
- **Text (`--color-text`):** `#262323` — Charcoal black. Primary color for headings, copy, and structural elements.
- **Card Wrapper (`--color-card-wrapper`):** `rgba(38, 35, 35, 0.04)` — Ultra-light translucent gray. Used for borders, grids, and table outlines.
- **Border (`--color-border`):** `rgba(38, 35, 35, 0.08)` — Translucent border color.
- **White (`--color-white`):** `#FFFFFF` — Pure white. Used inside active cards, buttons, or overlay containers.

### Accent & Interactive
- **Accent Color (`--color-accent`):** `#F55F24` — Bold Deep Orange / Coral. Used for CTA buttons, active navigation, interactive points, and highlight icons.

## 3. Typography Rules
### Hierarchy & Weights
- **Heading Font (`--font-heading`):** `'Tiposka', 'Courier New', monospace` — A distinct, custom monospaced display serif with strong industrial/geometric weight. Used exclusively for main section titles and numbers.
- **Body Font (`--font-body`):** `'HelveticaNeueCyr', 'Helvetica Neue', Arial, sans-serif` — Clean neo-grotesque sans-serif. Used for body text, lists, and navigation links.

### Typography Scale
- **H1 (Hero Titles):** Large display text, size scales with viewport using `min(120px, 8vw)` or similar, uppercase, uppercase letter-spacing `-0.02em`, `line-height: 0.8`.
- **H2 (Section Titles):** Large subtitles, size `min(54px, 4vw)`, bold or Tiposka regular, uppercase.
- **Body Bold / Large:** `font-size: 16px`, weight `700` or `500`.
- **Body Regular:** `font-size: 14px` or `16px`, weight `400`, line-height `1.4` or `1.35`.

## 4. Component Stylings
### Buttons
- **Pill Consult Button (`.btn-consult`):** Pill-shaped, border-radius `100px`, background `#F55F24`, text white. Sized at `14px 28px`. Senses scale transition on hover (`scale(1.02)`) and deep coral glow shadow.
- **Upload Scans Button (`.upload-action-btn`):** Circle of size `63px` containing an SVG/PNG icon. Hover turns background to `#262323` and inverts the icon colors, while text highlights in `#F55F24`.

### Cards & Layout Containers
- **Borders & Grids:** Hairline borders of `1px solid rgba(38, 35, 35, 0.08)` or clean divisions.
- **Card Background:** Background color `transparent` or `rgba(38,35,35,0.04)`. Card shadows are generally avoided unless elevated to focus attention.

## 5. Layout Principles
### Grid & Structure
- **Max Content Width:** 1920px (clips overflow on large desktop sizes).
- **Page Margin (`--margin`):** 50px on desktop, 32px on tablet, 20px on mobile.
- **Navigation:** Navigation spans standard header bar.

---

## 6. Design System Notes for Stitch Generation
When generating screens, use prompts that enforce:
- "Strict Swiss grid layout, dark charcoal text `#262323` on warm light gray background `#F9F9F9`."
- "Bold display headings using monospace styling, all uppercase, tight line height."
- "Borders should be extremely thin, using `rgba(38,35,35,0.08)` hairline dividers."
- "Call to action buttons should be perfectly rounded pill-shapes in deep orange `#F55F24`."
- "Data sections and stats grids should look like technical catalogs or grids, clean and structured."
