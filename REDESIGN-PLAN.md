# ANDF Website Visual Redesign — Bright, Inviting, Mobile-First

## Context
The current site uses a dark theme (#0A0A0A backgrounds, gold accents) that feels moody and exclusive. The user wants a **brighter, warmer, more inviting** design that matches the real ANDF brand identity (blue/orange logo, bright event flyers, community warmth). The homepage needs to drive engagement — showcasing upcoming events, "A New Day Now!" video content, and strong CTAs for donations and program signups. Must feel Hollywood-quality but warm. Most users view on mobile.

## Color Palette

### Primary Blue (from logo)
```
--primary-50: #EBF5FF    --primary-500: #1A73D4 (main)
--primary-100: #D1E9FF   --primary-600: #155DAD
--primary-200: #A3D3FF   --primary-700: #104788
--primary-300: #66B5FF   --primary-800: #0B3163
--primary-400: #3898ED   --primary-900: #071D3E
```

### Secondary Orange (sunrise element)
```
--secondary-50: #FFF5EB   --secondary-500: #F07D1A (main)
--secondary-100: #FFE5CC  --secondary-600: #CC6600
--secondary-200: #FFCC99  --secondary-700: #994D00
--secondary-300: #FFB366  --secondary-800: #663300
--secondary-400: #FF9933  --secondary-900: #3D1F00
```

### Accent Teal
```
--accent-50: #E6FAF5   --accent-500: #0DBF94 (main)
--accent-600: #0A9975
```

### Warm Neutrals (not cold gray)
```
--neutral-50: #FAFAF8 (page bg)   --neutral-500: #78716C
--neutral-100: #F5F3F0             --neutral-600: #57534E
--neutral-200: #E8E5E0             --neutral-700: #44403C
--neutral-300: #D4D0CA             --neutral-800: #292524
--neutral-400: #A8A29E             --neutral-900: #1C1917
```

### Semantic Tokens (light mode)
```
--background: #FAFAF8       --foreground: #1C1917
--background-card: #FFFFFF  --foreground-muted: #57534E
--background-elevated: #F5F3F0  --foreground-subtle: #78716C
--border: #E8E5E0           --border-hover: #D4D0CA
--ring: rgba(26,115,212,0.4)
```

**Keep existing gold scale** for donation moments only. **Keep fonts** (Playfair Display + Inter — excellent pairing).

## Admin Panel Isolation
Add `data-theme="dark"` to the admin layout root `<div>`. Add scoped CSS block in globals.css preserving all current dark values for `[data-theme="dark"]`. Admin stays untouched.

## Homepage Redesign — New Section Order

### 1. Hero (redesign `hero-section.tsx`)
- Bright photo bg from `website Assetes/images/` with white overlay for text readability
- Dark heading text, accent words in `text-primary-500`
- CTAs: "Donate" (orange), "Explore Programs" (blue)
- Remove all 20 particle divs (dark-theme aesthetic)
- Blue pill badge instead of gold border

### 2. "A New Day Now!" (NEW: `andf-now-section.tsx`)
- Featured video 2/3 width + 2 stacked cards 1/3 (desktop). Full-width scroll (mobile)
- `bg-primary-50` to white gradient background
- Orange play buttons with pulse ring animation
- Links to `/live` page
- Uses poster frames from `website Assetes/and now/` videos

### 3. Events (redesign `events-carousel.tsx`)
- Real event flyer images from `website Assetes/events/`
- Mobile: horizontal snap-scroll carousel
- White cards, subtle shadow, colored left border stripe
- Green badges "Registration Open", orange "Coming Soon"
- Blue icons/CTAs instead of gold

### 4. Impact Stats (redesign `impact-stats.tsx`)
- Blue gradient (`from-primary-500 to-primary-700`) with white text
- Remove GoldDivider

### 5. Programs Preview (redesign `programs-preview.tsx`)
- Real program photos from `website Assetes/` as card hero images
- White cards (`bg-white border-neutral-200`)
- Light tinted icon backgrounds (`bg-violet-100 text-violet-600`, etc.)
- Blue/orange accents instead of gold

### 6. Partners Marquee (NEW: `partners-section.tsx`)
- CSS `@keyframes scroll` auto-scrolling logo rows (two rows, opposite directions)
- Grayscale default, color on hover
- All 31+ logos from `website Assetes/partner images/`

### 7. Testimonials (redesign `testimonials-slider.tsx`)
- `bg-primary-50` background, white cards
- Blue quote marks, blue active dots

### 8. Donation CTA (redesign `donation-cta.tsx`)
- Full-bleed orange (`bg-secondary-500`) with white text
- Blue CTA button for contrast

**Remove standalone Mission section** — fold content into Hero subtitle.

## Component Changes

| Component | Changes |
|-----------|---------|
| `globals.css` | Full palette swap, new color scales, light semantic tokens, admin dark scope |
| `button.tsx` | Primary=blue bg, outline=blue border, add `accent` variant (orange) |
| `card.tsx` | `bg-white`, shadow instead of glass/glow |
| `badge.tsx` | Add blue/orange tint variants |
| `section-heading.tsx` | Label `text-primary-500`, gradient uses brand colors |
| `gold-divider.tsx` | Rename to `brand-divider.tsx`, blue gradient |
| `logo.tsx` | Use actual PNG logo via `<Image>` with SVG fallback, update colors to blue/orange |
| `navbar.tsx` | White/transparent bg, blue active states |
| `footer.tsx` | Dark footer (`bg-neutral-800`) with light text, orange accents |

## Asset Deployment

Copy from `website Assetes/` to `public/images/`:
```
public/images/
  logo/andf-logo.png
  hero/community-group.jpg
  events/evening-with-dawnn.png, topgolf-atlanta.png, hbcu-classic.png, ...
  programs/band-camp-logo.jpg, drone-teach.jpg, ...
  partners/coca-cola.jpg, google.png, la-dodgers.png, la-lakers.png, ...
  gallery/(remaining photos)
videos/
  giving-tuesday.mp4, andf-promo.mp4
```
All served via Next.js `<Image>` with `sizes` prop. Hero image gets `priority`.

## Implementation Order

### Phase 1: Foundation
1. `globals.css` — full palette swap + admin dark scope

### Phase 2: Core UI
2. `button.tsx`, `card.tsx`, `badge.tsx`
3. `section-heading.tsx`, `gold-divider.tsx` → `brand-divider.tsx`

### Phase 3: Layout Shell
4. `logo.tsx` — blue/orange update
5. `navbar.tsx` — light bg
6. `footer.tsx` — dark footer with new colors
7. `(admin)/layout.tsx` — add `data-theme="dark"` to root div

### Phase 4: Homepage Sections
8. `hero-section.tsx`
9. `impact-stats.tsx`
10. `programs-preview.tsx`
11. `events-carousel.tsx`
12. `testimonials-slider.tsx`
13. `donation-cta.tsx`

### Phase 5: New Sections
14. Create `andf-now-section.tsx`
15. Create `partners-section.tsx`
16. Update `page.tsx` — new imports + section order

### Phase 6: Public Pages
17. Update all `(public)/` pages: live, about, programs, events, gallery, contact, donate

### Phase 7: Assets (parallel with any phase)
18. Copy/rename assets from `website Assetes/` to `public/`

## Mobile-First Strategy
- Design for 375px first, scale up at breakpoints
- Touch targets min 44x44px, primary CTAs in bottom 60% of viewport
- Hero: `text-4xl` mobile → `text-7xl` desktop
- Events: snap-scroll carousel (mobile) → 3-col grid (desktop)
- Programs: single column with "See All" (mobile) → 3-col grid (desktop)
- Partners: single row auto-scroll (mobile) → two rows (desktop)
- All images use `<Image>` with responsive `sizes`

## Animation Updates
- Remove gold particles from hero
- Rename `pulse-gold` → `pulse-brand` with blue rgba
- `.text-gold-gradient` → `.text-brand-gradient` (blue-to-orange)
- Add CSS `@keyframes scroll` for partner marquee
- Keep all scroll-triggered fades, hover lifts, counter animations

## Verification
1. `next dev --webpack`, navigate to homepage
2. Confirm bright palette across all sections
3. Verify admin panel at `/admin` still uses dark theme
4. Test mobile layout (375px) and desktop (1440px)
5. Check all 7 program pages render correctly
6. Verify partner logos display in marquee
7. Test "A New Day Now!" section video cards + click interaction
8. Confirm events carousel with real flyer images
9. Test donation CTA and program signup CTAs
10. Verify all animations trigger on scroll
