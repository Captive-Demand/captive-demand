# Design canvas sources — /direct-booking lander

These are the artboard sources behind the published design canvas for the
direct booking lander (lead direction on mobile and desktop, plus two
alternate hero directions). They double as an implementation reference:
every value in them is lifted from the site's real tokens and components.

- `Main.src.html` — mobile, lead direction (ink hero and calculator, then paper)
- `Desktop.src.html` — desktop, lead direction (hero, how it works, the math)
- `DirectionA.src.html` — alternate: every section stays on ink
- `DirectionC.src.html` — alternate: the fee is the hero, photo demoted to a card
- `canvas.json` — artboard layout and sticky notes
- `build.mjs` — injects the shared CSS and the Nohemi faces into `*.dc.html`

## Rebuilding

The build expects, in the same folder: `nohemi-300.b64` and `nohemi-400.b64`
(base64 of `public/fonts/Nohemi-Light-*.ttf` and `Nohemi-Regular-*.ttf`),
plus `hero-mobile.jpg`, `hero-desktop.jpg`, `northstar.jpg` (downsampled
from `public/direct-booking/hero-*.jpg` and `public/northstarnaturesuites.png`,
each under 70 KB) and `public/captive-demand-logo.png`. Then `node build.mjs`.

## Values worth copying into code

- Ink `#1a1512`, paper `#FAF9F6`, orange `#ff5501`, pressed orange `#E8480C`,
  grey rows `#f3f4f6`, borders `#e8e8e8`.
- Raised paper card: `box-shadow: 0 1px 2px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.4), inset 0 -1px 0 0 rgba(0,0,0,0.04)`
- Dark bevel: `inset 0 1px 0 0 rgba(255,255,255,0.15)`
- CTA: 56 px, radius 14, `inset 0 1px 0 rgba(255,255,255,0.28), 0 10px 28px rgba(255,85,1,0.28)`
- Display: Nohemi 300 for H1/H2 (44 px mobile, 62 px desktop hero), Nohemi 400 for card titles; tracking -0.02em.
- Eyebrows: the bracketed `EyebrowHeading` pattern from `src/components/ui/eyebrow-heading.tsx`.
