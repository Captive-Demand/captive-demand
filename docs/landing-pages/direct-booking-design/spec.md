# Build Spec — Direct Booking Design Lander (`/direct-booking`)

**Status:** Ready to build. Items tagged `⚠ JORDAN` need confirmation before **launch**, not before build — build against the defaults given.
**Companion:** `brief.md` in this folder (the original campaign brief). This spec wins where the two disagree.
**Branch:** `claude/loving-mccarthy-nwwpzd` (spec) → build on a `cursor/*` branch off `main`.
**Last updated:** 2026-09-14

---

## 0. Decisions from the strategy workshop

| # | Decision | Default to build | Status |
|---|----------|------------------|--------|
| 1 | URL | `/direct-booking` | ⚠ JORDAN |
| 2 | Scheduling tool | Calendly, **inline** embed. Qualifying questions live **inside Calendly** (asked after the time is picked). No pre-form step on our page. | Decided |
| 3 | Meta conversion event | `Schedule` (standard event), fired **client-side** on Calendly's `calendly.event_scheduled` message, with an `eventID` derived from the Calendly invitee so a server-side Conversions API event can dedupe against it later. `Lead` is **not** fired on this page. | Decided |
| 4 | GA4 | Fire events directly through the existing `trackGa4Event` helper (site runs gtag via `@next/third-parties`, GTM is not mounted). **No GTM** for this build. | Decided |
| 5 | Meta Pixel base code | Mounted **site-wide** in the root layout, env-gated like GA4. PageView everywhere; `Schedule` only on this route. | ⚠ JORDAN (Pixel ID) |
| 6 | Attribution passthrough | UTMs + `fbclid` captured on landing, persisted in `sessionStorage`, passed into Calendly's `utm` option. `salesforceUuid` carries the Meta `_fbc` value. | Decided |
| 7 | Confirmation state | Stays on-page. Calendly's own confirmation screen (time in their timezone + add-to-calendar) stays inside the embed; we swap the copy **above** the embed to a "You're booked" block. **No Calendly redirect.** | Decided |
| 8 | Proof section | North Star Nature Suites (luxury cabin suites, TN) — a direct booking site we designed and built. Screenshot already in `/public/northstarnaturesuites.png`. | ⚠ JORDAN (stats + permission) |
| 9 | Calculator | Yes. One slider, one output. | Decided |
| 10 | Phone number on the Calendly form | Enable Calendly "text reminders" (adds a phone field). Costs some conversion, buys show rate. | ⚠ JORDAN |
| 11 | Chrome | No nav, no footer links except Privacy, logo **not** linked. No exit-intent modal, no chat FAB, no HubSpot form. | Decided |
| 12 | Motion | CSS-only reveals. No GSAP, no framer-motion on this route. | Decided |
| 13 | Hero image | The dome-at-dusk image from the live ad. | ⚠ JORDAN (asset) |

---

## 1. Route, chrome, and SEO

### 1.1 Files

```
src/app/direct-booking/page.tsx                       # server component, metadata, viewport
src/components/landers/direct-booking/
  DirectBookingLander.tsx                             # section composition (server)
  copy.ts                                             # ALL customer-facing copy, exported constants
  LanderCtaButton.tsx                                 # solid orange CTA (client)
  Hero.tsx
  HowItWorks.tsx
  FeeMath.tsx                                         # section wrapper (server)
  FeeCalculator.tsx                                   # slider (client)
  CallAgenda.tsx
  Proof.tsx                                           # "Why us" + North Star card
  TheCatch.tsx
  BookingSection.tsx                                  # heading/trust line/confirmation swap (client)
  CalendlyInline.tsx                                  # embed + postMessage listener (client)
  Faq.tsx                                             # accordion (client)
  StickyCta.tsx                                       # mobile-only (client)
  LanderFooter.tsx
  SectionViewTracker.tsx                              # IntersectionObserver → GA4 (client)
src/lib/direct-booking-lander.ts                      # path const, Calendly URL resolver, event names, tracking helpers
src/lib/attribution.ts                                # UTM / fbclid capture + Calendly utm mapping
src/lib/meta-pixel.ts                                 # fbq typing + trackMetaEvent()
src/lib/standalone-landers.ts                         # generalises isShorePartnershipPath
src/components/analytics/MetaPixel.tsx                # site-wide base code (env-gated)
```

### 1.2 Hide site chrome on lander paths

Create `src/lib/standalone-landers.ts`:

```ts
export const STANDALONE_LANDER_PATHS = ['/shore-capital-partnership', '/direct-booking'] as const;

export function isStandaloneLanderPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const normalized = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return (STANDALONE_LANDER_PATHS as readonly string[]).includes(normalized);
}
```

Then switch these three call sites from `isShorePartnershipPath` to `isStandaloneLanderPath` (keep `isShorePartnershipPath` exported for anything else that imports it):

- `src/components/layout/Navbar.tsx` (returns `null` on lander paths)
- `src/components/layout/DeferredFooter.tsx` (returns `null` on lander paths)
- `src/components/providers/SiteReCaptchaProvider.tsx` — **new behaviour:** on lander paths render the empty-context branch so the reCAPTCHA v3 script is not loaded on this route (it is a ~100 KB third-party script the page never uses). Use `usePathname()`; the component is already `'use client'`.

### 1.3 Metadata

```ts
export const metadata = createSeoMetadata({
  title: 'Free direct booking site design for unique stays',
  description: 'Airbnb takes 15.5%. We design a direct booking website for your glamping, dome, cabin, or tiny-home property, free. Starts with a 15-minute call.',
  path: '/direct-booking',
  image: '/direct-booking/og.jpg',            // ⚠ JORDAN — export from the ad creative, 1200×628
  robots: { index: false, follow: false },
});

export const viewport = { themeColor: '#1a1512' };
```

- Do **not** add the route to `src/app/sitemap.ts`.
- `robots.ts` needs no change (noindex is on the page).

### 1.4 Page wrapper

The root layout wraps every route in `<main class="bg-[#fafafa]">`. The lander's outer `<div>` sets `min-h-svh bg-[#1a1512] text-[#FAF9F6]` so no light background ever shows. Reuse `NoiseOverlay` at `opacity 0.02` on the wrapper (it's a canvas data-URL, cheap).

---

## 2. Design

### 2.1 Tokens for this route

| Token | Value | Use |
|-------|-------|-----|
| Ink | `#1a1512` | Page background (matches ad charcoal) |
| Panel | `bg-white/[0.04] border border-white/10` | Cards, calculator, FAQ rows, proof card |
| Paper | `#FAF9F6` | Headings, body |
| Muted | `text-[#FAF9F6]/65` | Supporting copy, trust lines |
| Accent | `#FF5501` | Primary CTA fill, eyebrow text, slider track. ⚠ JORDAN — if the ad's button is a rust tone rather than `#FF5501`, use the ad's hex for the CTA only. |
| Eyebrow | `font-mono text-[11px] uppercase tracking-[0.18em] text-[#FF5501]` | Section labels |
| H1 | `font-nohemi font-normal tracking-[-0.02em] text-[2.25rem] leading-[1.05] sm:text-5xl lg:text-6xl` | Hero only |
| H2 | `font-nohemi font-normal tracking-[-0.01em] text-3xl sm:text-4xl` | Section titles |
| Body | `text-[17px] leading-relaxed` (Inter via `--font-sans`) | |

Container widths: `max-w-3xl` for prose sections, `max-w-5xl` for the three-step strip and the booking section. Horizontal padding `px-container-px`. Vertical rhythm `py-14 sm:py-20`.

### 2.2 CTA button (`LanderCtaButton`)

Do **not** use `CTAButton` (the agency "arrow blob" button is mono/uppercase/13px and visually belongs to the main site). This is a deliberate deviation for an ad lander: the button must read like the ad's button and be thumb-sized.

- `<a href="#book">` (or `<button>` for sticky), full width on mobile, `min-h-14`, `rounded-xl`, `bg-[#FF5501] text-white text-[17px] font-medium`, `active:scale-[0.99]`, focus ring `ring-2 ring-[#FF5501]/60 ring-offset-2 ring-offset-[#1a1512]`.
- Props: `location: 'hero' | 'after_math' | 'after_catch' | 'sticky'`, `className?`.
- `onClick`: `trackLander('cd_dbl_cta_click', { cta_location: location })` → `document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' })` → `window.dispatchEvent(new CustomEvent('cd-dbl:load-calendly'))`. Respect `prefers-reduced-motion` (use `behavior: 'auto'`).
- Same text everywhere: the `CTA_TEXT` constant from `copy.ts`.

### 2.3 Hero

- Full-bleed image (`next/image`, `fill`, `object-cover`, `priority`, `sizes="100vw"`, `quality={75}`), dark gradient overlay `from-[#1a1512]/40 via-[#1a1512]/75 to-[#1a1512]` bottom-heavy so text sits on near-solid ink.
- Asset: `/public/direct-booking/hero.jpg` — ⚠ JORDAN supplies the ad image. Export at 1600 px wide, target **≤ 120 KB** (run `scripts/optimize-public-images.mjs` or export AVIF/WebP). Also export a 800 px mobile crop if the composition needs it; use `<picture>`-style `sizes` rather than two components.
- Above-the-fold check: eyebrow, H1, subhead, CTA, and trust line must all be visible without scrolling on a **390×844** viewport; the CTA itself must be visible on **375×667**.
- Hero is the LCP element. Nothing else on the page may be `priority`.

### 2.4 Sticky CTA (mobile only, `md:hidden`)

- Fixed bottom bar, `bg-[#1a1512]/92 backdrop-blur-md border-t border-white/10`, padding `px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]`.
- Shows when the hero has scrolled out of view. Hides while the booking section is in view and permanently after a booking. One `IntersectionObserver` for the hero, one for `#book`.
- Slides in/out with a CSS transform transition. Never overlaps Calendly's own buttons (that's why it hides over `#book`).

### 2.5 Reveals

Sections fade/translate in on first intersection using a `[data-reveal]` attribute + one small client component that toggles a class. `prefers-reduced-motion: reduce` → no transform, opacity only. No animation library.

---

## 3. Page sections and copy

Everything in the **Ships** blocks is customer-facing and goes into `copy.ts` verbatim. Anything labelled *Build note* is for you, never for the page. Hero lines marked ⚠ may change after Jordan confirms the final ad copy — keep them as single constants so it's a one-line change.

### 3.1 Hero

**Ships**

- Eyebrow: `For multi-unit, unique stays — glamping, domes, cabins, tiny homes`
- H1 ⚠: `Airbnb's cut is 15.5% now. Your own booking site takes nothing.`
- Subhead: `We'll design a direct booking website for your property, free. It's yours to keep. All it takes is a 15-minute call so the design fits how you actually take bookings.`
- CTA ⚠: `Book my 15-minute call`
- Trust line (directly under the button): `No sales pitch on the call. The design is yours whether you work with us or not.`

*Build note:* the H1's first sentence deliberately repeats the live ad's headline word for word. If the ad headline changes, the H1's first sentence changes with it.

### 3.2 How it works (`id="how"`)

Three cards; horizontal strip on `md+`, stacked on mobile. Small numerals `01 / 02 / 03` in mono accent, no icons.

**Ships**

- Eyebrow: `How it works`
- Step 1 title: `Book a 15-minute call` — body: `Pick a time that works. Tell us about your property, how you take bookings now, and what's frustrating you.`
- Step 2 title: `We design your booking site` — body: `About a week later, we walk you through a design built for your property — your photos, your units, your booking flow.`
- Step 3 title: `It's yours` — body: `Keep the design. Build it yourself, hire whoever you want, or ask us to build and run it. No obligation either way.`

### 3.3 What 15.5% costs you (`id="math"`)

**Ships**

- Eyebrow: `The math`
- H2: `What 15.5% actually costs you`
- Body: `If you do $50,000 a year through Airbnb, about $7,750 of it is fees. Every guest who rebooks with you directly is a booking you keep all of. Most operators we talk to already have repeat guests who'd happily book direct. They just don't have a site worth sending them to.`
- Calculator label: `Your annual bookings through Airbnb`
- Calculator output (live): `≈ $7,750 a year in Airbnb fees` (number updates)
- Calculator footnote: `Based on Airbnb's 15.5% host-only service fee.`
- CTA (repeat, `location="after_math"`) + the same trust line as the hero.

*Build note:* the brief's "20–30% of bookings direct" line is dropped on purpose. Do not reintroduce a percentage.

**Calculator behaviour (`FeeCalculator`, client):**

- `<input type="range">` min `10000`, max `500000`, step `5000`, default `50000`. Styled track (accent) + a large thumb (≥ 28 px) for mobile. Show the current input value formatted `$50,000` above the slider.
- Output = `Math.round(value * 0.155)`, formatted with `Intl.NumberFormat('en-US')`. Rate lives in one constant `AIRBNB_HOST_FEE_RATE = 0.155`.
- On the **first** change only, fire `cd_dbl_calculator_used`. Debounce nothing else; no tracking per tick.
- `aria-valuetext` on the slider: `"$50,000 a year"`.

### 3.4 What the call is for (`id="call"`)

**Ships**

- Eyebrow: `The call`
- H2: `What the call is actually for`
- Intro: `We're not going to pitch you. We're going to ask:`
- List:
  - `Where you manage your calendar and bookings today — Airbnb only, Vrbo, a booking system?`
  - `Whether you have a website, and if so, what's wrong with it`
  - `How many units you have and what makes them different`
  - `What a guest goes through today if they want to book direct`
  - `What you'd want the site to do that it doesn't do now`
- Close: `That's it. Fifteen minutes, maybe twenty if you're chatty. We use it to design something that fits your property instead of a generic template.`

### 3.5 Why us + proof (`id="proof"`)

**Ships**

- Eyebrow: `Who you're talking to`
- H2: `We've done this for unique stays before`
- Body: `We're a Nashville agency that builds websites and runs ads for hospitality businesses, including unique stays. We know the booking platforms — which ones sync with Airbnb and Vrbo without double-booking, which ones let guests book without leaving your site. We've looked at a lot of glamping websites. Most of them are losing bookings they don't know about.`
- Proof card:
  - Image: `/northstarnaturesuites.png` (existing) inside a simple browser-frame treatment (reuse `MockBrowserWindow` if it fits on dark; otherwise a plain rounded frame).
  - Caption line 1: `North Star Nature Suites — luxury cabin suites, Tennessee`
  - Caption line 2: `Direct booking site designed and built by Captive Demand`
  - Stat chips ⚠ JORDAN: `+289% direct bookings` · `OTA dependency down 60%`

*Build note:* the two stats are already published on `/services/seo` (`SEOCaseStudies.ts`). Ship them **only** if Jordan confirms they're accurate and he's fine using the client name on an ad lander. If not confirmed at launch, ship the card with the two caption lines and **no** stat chips. Do not add any other testimonial, logo wall, or quote.

### 3.6 So what's the catch (`id="catch"`)

**Ships**

- Eyebrow: `Straight answer`
- H2: `So what's the catch?`
- Body: `There isn't one, but here's the honest version. We design the site free because some people who see the design want us to build it and run it for them. That's a paid monthly service, and we'll tell you exactly what it costs on the second call — not before, and not by surprise. If you'd rather take the design somewhere else, that's fine. You'll still have a design that's better than what you've got.`
- CTA (repeat, `location="after_catch"`) + trust line.

### 3.7 Booking (`id="book"`)

**Ships — before booking**

- Eyebrow: `Pick a time`
- H2: `Pick a time`
- Trust line: `15 minutes. No pitch. The design is yours to keep.`
- Embed below.
- Fallback link (only rendered if the Calendly script fails to load): `Calendar not loading? Open it in a new tab.` → the Calendly URL with UTM query string appended, `target="_blank" rel="noopener"`.

**Ships — after booking (replaces the three lines above; embed stays visible)**

- Eyebrow: `You're booked`
- H2: `You're booked.`
- Body: `The time, your timezone, and an add-to-calendar button are right below and in your confirmation email. On the call we'll ask about your property and how you take bookings today. About a week later we'll walk you through the design.`
- Prep line: `One thing to have handy: a link to your current website or Airbnb listing, if you didn't add it on the form.`

*Build note:* Calendly renders its own confirmation screen inside the iframe with the booked time in the invitee's timezone and add-to-calendar buttons. Don't rebuild those. After booking, `scrollIntoView` the section heading so the "You're booked" block and the top of the confirmation are both on screen.

### 3.8 FAQ (`id="faq"`)

Five items, all collapsed by default, one open at a time, `<button aria-expanded>` + `aria-controls`, Plus icon rotates to ×. Reuse the visual pattern of `FAQSection.tsx`'s accordion item (dark row when open) but **do not import `FAQSection`** — it pulls in framer-motion, GSAP, and homepage FAQ data.

**Ships**

- Eyebrow: `Questions`
- H2: `Before you book`
- Q: `Do I need a website already?` — A: `No. Most people we talk to either don't have one or have one they're embarrassed by. Either is fine.`
- Q: `I only use Airbnb. Does this still make sense?` — A: `Yes — that's the most common situation. We'll talk through what it takes to add direct booking alongside Airbnb without double-booking.`
- Q: `Is the design really free?` — A: `Yes. You keep it. No card, no contract.`
- Q: `What if I want you to build it?` — A: `We'll tell you what that costs on the second call. It's a monthly service. No pressure.`
- Q: `How long until I see the design?` — A: `About a week after the first call.`

Add `FAQSchema` JSON-LD? **No** — the page is noindex; skip schema entirely.

### 3.9 Footer

**Ships**

- Captive Demand logo (`/captive-demand-logo.png`, inverted to white via `brightness-0 invert`), **not a link**.
- `Nashville, TN`
- `Privacy` → `/privacy`
- `© 2026 Captive Demand`

Nothing else. No social icons, no phone, no email.

---

## 4. Calendly

### 4.1 Event type setup (Jordan, in Calendly — not code) ⚠ JORDAN

- Event name: `Direct booking site design — 15 min`. Duration 15. Location: Google Meet (or phone — his call).
- **Invitee questions, in this exact order** (order matters: they map to `a1`…`a5` if we ever prefill):
  1. `Property name` — one-line text, required
  2. `How do you take bookings today?` — radio, required: `Airbnb only` / `Airbnb + Vrbo` / `A booking system (Hostaway, Guesty, Beds24, Lodgify, etc.)` / `Something else`
  3. `How many units?` — radio, required: `1–2` / `3–5` / `6–10` / `10+`
  4. `Rough annual bookings through Airbnb` — radio, required: `Under $25k` / `$25–50k` / `$50–100k` / `$100k+` / `Prefer not to say`
  5. `Link to your website or Airbnb listing` — one-line text, optional
- Built-in name + email stay. Turn on **text reminders** (adds phone) if decision #10 is yes.
- Confirmation page: **Calendly default** (do not set a redirect).
- Reminders: email 24 h and 1 h before. SMS 1 h before if enabled.
- Availability: minimum notice 4 h, max 14 days out, 15-min buffer after. (Show-rate hygiene; his call.)
- Give us the event URL, e.g. `https://calendly.com/<handle>/direct-booking-design-call`.

*Build note:* the brief's "Do you have a website? (No / Yes — enter URL)" became question 5 because Calendly has no conditional fields; an optional link field answers both halves.

### 4.2 Config

- `NEXT_PUBLIC_CALENDLY_EVENT_URL` — the event URL above. Add to `.env.example` and to Netlify env.
- Resolver in `src/lib/direct-booking-lander.ts`:

```ts
const CALENDLY_EMBED_PARAMS =
  'hide_gdpr_banner=1&hide_event_type_details=1&background_color=1a1512&text_color=faf9f6&primary_color=ff5501';

export function resolveCalendlyEmbedUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_CALENDLY_EVENT_URL?.trim();
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (u.hostname !== 'calendly.com') return null;
    const join = u.search ? '&' : '?';
    return `${u.toString()}${join}${CALENDLY_EMBED_PARAMS}`;
  } catch {
    return null;
  }
}
```

  If the resolver returns `null`, render the booking section with a visible dev-only warning and no embed (never ship an empty section silently — `console.error` in dev, and the fallback link is hidden because there is no URL).

- Netlify: append `NEXT_PUBLIC_CALENDLY_EVENT_URL` and `NEXT_PUBLIC_META_PIXEL_ID` to `SECRETS_SCAN_OMIT_KEYS` in `netlify.toml` (they're `NEXT_PUBLIC_*`, so they get inlined into bundles and the secrets scanner will flag them exactly as it did for the reCAPTCHA key).

### 4.3 Loading the widget (`CalendlyInline`, client)

- Load `https://assets.calendly.com/assets/external/widget.js` **on demand**, not on page load. Trigger: the booking section enters a `rootMargin: '800px 0px'` observer **or** the `cd-dbl:load-calendly` custom event fires (any CTA click), whichever first. Single promise so it never loads twice:

```ts
let calendlyLoad: Promise<void> | null = null;
export function loadCalendlyScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('ssr'));
  if (window.Calendly) return Promise.resolve();
  if (!calendlyLoad) {
    calendlyLoad = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('calendly-script'));
      document.head.appendChild(s);
    });
  }
  return calendlyLoad;
}
```

- The inline embed does not need `widget.css` (that's for the popup/badge). Don't load it.
- Init:

```ts
window.Calendly.initInlineWidget({
  url: embedUrl,
  parentElement: containerRef.current,
  prefill: {},
  utm: toCalendlyUtm(getAttribution()),   // see §5.3
});
```

- Container: `min-h-[680px] md:min-h-[720px] w-full rounded-2xl overflow-hidden`. Calendly's script sets the iframe to fill the parent; verify on iPhone that the question step and confirmation aren't clipped, and raise the min-height if they are. Show a skeleton (`animate-pulse` panel) until the `calendly.event_type_viewed` message arrives.
- If `loadCalendlyScript()` rejects (ad blocker / network), show the fallback link from §3.7.
- Type shim (put in `src/types/calendly.d.ts`):

```ts
interface CalendlyUtm {
  utmCampaign?: string; utmSource?: string; utmMedium?: string;
  utmContent?: string; utmTerm?: string; salesforceUuid?: string;
}
interface CalendlyInlineOptions {
  url: string;
  parentElement: HTMLElement;
  prefill?: { name?: string; email?: string; customAnswers?: Record<string, string> };
  utm?: CalendlyUtm;
}
interface Window {
  Calendly?: { initInlineWidget: (opts: CalendlyInlineOptions) => void };
}
```

### 4.4 Listening for bookings (the part that feeds the pixel)

Calendly posts messages to the parent window. Listen once, at the `CalendlyInline` level:

```ts
useEffect(() => {
  function onMessage(e: MessageEvent) {
    if (e.origin !== 'https://calendly.com') return;
    const name: unknown = e.data?.event;
    if (typeof name !== 'string' || !name.startsWith('calendly.')) return;

    switch (name) {
      case 'calendly.event_type_viewed':
        setReady(true);
        trackLander('cd_dbl_calendar_loaded');
        break;
      case 'calendly.date_and_time_selected':
        trackLander('cd_dbl_calendar_time_selected');
        break;
      case 'calendly.event_scheduled': {
        const inviteeUri: string | undefined = e.data?.payload?.invitee?.uri;
        const eventUri: string | undefined = e.data?.payload?.event?.uri;
        const inviteeId = inviteeUri?.split('/').filter(Boolean).pop();
        onScheduled({ inviteeId, inviteeUri, eventUri });
        break;
      }
      default:
        break;
    }
  }
  window.addEventListener('message', onMessage);
  return () => window.removeEventListener('message', onMessage);
}, [onScheduled]);
```

`onScheduled` (in `BookingSection`) runs **exactly once** per page life (guard with a ref and `sessionStorage['cd_dbl_booked']`):

```ts
const eventID = inviteeId ? `calendly-${inviteeId}` : `cd-${crypto.randomUUID()}`;

trackMetaEvent('Schedule', {
  content_name: 'direct-booking-design-call',
  content_category: 'unique-stays',
}, { eventID });

trackGa4Event('generate_lead', {
  lead_source: 'calendly',
  page_variant: 'direct-booking-v1',
  calendly_invitee_id: inviteeId ?? '(none)',
});

setBooked(true);
sessionStorage.setItem('cd_dbl_booked', '1');
document.getElementById('book')?.scrollIntoView({ block: 'start' });
```

Why `eventID` is built from the invitee id: Calendly's `invitee.created` webhook carries the same invitee URI, so a future server-side Conversions API call can send the identical `event_id` and Meta will dedupe (§5.5).

If `sessionStorage['cd_dbl_booked']` is already `'1'` on mount (they refreshed after booking), render the booked state and **do not** fire the events again.

---

## 5. Tracking

### 5.1 Meta Pixel base (`MetaPixel.tsx`, mounted in `src/app/layout.tsx` next to `SiteGoogleAnalytics`)

- Env: `NEXT_PUBLIC_META_PIXEL_ID` ⚠ JORDAN. Skips in development unless `NEXT_PUBLIC_META_PIXEL_IN_DEV=true` (mirror the GA4 component).
- `next/script` with `strategy="afterInteractive"`, standard `fbevents.js` bootstrap, then `fbq('init', ID)` and `fbq('track', 'PageView')`. Include the `<noscript><img …/tr?id=…&ev=PageView&noscript=1></noscript>` fallback.
- App Router fires the inline script once per hard load. Add a tiny client component (`MetaPixelRouteChange`) that calls `fbq('track','PageView')` on `usePathname()` change **after** the first render, so soft navigations on the main site are counted too. Not needed for the lander itself, but it keeps the site-wide install honest.
- `src/lib/meta-pixel.ts`:

```ts
type Fbq = (...args: unknown[]) => void;
declare global { interface Window { fbq?: Fbq } }

export function trackMetaEvent(
  name: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string },
): boolean {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return false;
  window.fbq('track', name, params ?? {}, options ?? {});
  return true;
}
```

### 5.2 GA4 events (all through `trackGa4Event` from `@/lib/analytics`)

Wrap it in `trackLander(event, params)` in `src/lib/direct-booking-lander.ts` so every event automatically carries `page_variant: 'direct-booking-v1'`.

| Event | When | Params |
|-------|------|--------|
| `generate_lead` | `calendly.event_scheduled` | `lead_source: 'calendly'`, `calendly_invitee_id` |
| `cd_dbl_cta_click` | any primary CTA click | `cta_location: hero \| after_math \| after_catch \| sticky` |
| `cd_dbl_section_view` | a section's first intersection (50% visible) | `section: how \| math \| call \| proof \| catch \| book \| faq` |
| `cd_dbl_calculator_used` | first slider change | — |
| `cd_dbl_calendar_loaded` | `calendly.event_type_viewed` | — |
| `cd_dbl_calendar_time_selected` | `calendly.date_and_time_selected` | — |
| `cd_dbl_faq_open` | FAQ item opened | `question` (first 60 chars) |

`cd_dbl_section_view` is the scroll-depth instrument: it gives the funnel the brief wants (hero → how → math → … → book) as named steps instead of percentages. GA4 enhanced measurement already records 90% scroll; leave it on.

⚠ JORDAN (GA4 admin): mark `generate_lead` as a key event and build one exploration: `cd_dbl_section_view` by `section` → `cd_dbl_calendar_loaded` → `cd_dbl_calendar_time_selected` → `generate_lead`. That's the four failure modes in the brief, instrumented.

### 5.3 Attribution capture (`src/lib/attribution.ts`)

```ts
export interface Attribution {
  utm_source?: string; utm_medium?: string; utm_campaign?: string;
  utm_content?: string; utm_term?: string;
  fbclid?: string; landing_path?: string; landed_at?: string;
}
const KEY = 'cd_attribution';
const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'] as const;

/** Call once on mount. Merges URL params over anything stored this session; never throws. */
export function captureAttribution(): Attribution
/** Stored value (or {}). */
export function getAttribution(): Attribution
/** `_fbc` cookie if the pixel already set it, else `fb.1.<now>.<fbclid>` if fbclid exists, else undefined. */
export function getFbc(fbclid?: string): string | undefined
/** Maps to Calendly's option names. Missing UTMs → utmSource 'no-utm' so Calendly shows the gap. */
export function toCalendlyUtm(a: Attribution): CalendlyUtm
```

Rules:

- Read `window.location.search` on the lander's mount (a client `AttributionCapture` component rendered once near the top of the page). Persist to `sessionStorage`. A later visit in the same session with **new** UTMs overwrites; a visit with none keeps the stored set.
- `salesforceUuid` = `getFbc(a.fbclid)`. This is the only Calendly tracking field left after the five UTMs, and it's just a string Calendly stores on the invitee — we use it to carry the Meta click id so a server-side event can include `fbc` later. Verify after the first test booking that the value shows up on the invitee record in Calendly (Invitee details → UTM/tracking, or the CSV export). If Calendly truncates it, fall back to the raw `fbclid`.
- Never send name/email prefill; we don't have it.

⚠ JORDAN (Ads Manager) — set this as the ad's URL parameters so every booking is attributable to a creative:

```
utm_source=meta&utm_medium=paid-social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
```

Meta appends `fbclid` itself. Cost per booked call by creative = Ads Manager `Schedule` conversions by ad, cross-checked against Calendly's invitee export grouped by `utm_content`.

### 5.4 Verification (do these before calling it done)

1. Meta Pixel Helper (Chrome): on load exactly one `PageView`; after a test booking exactly one `Schedule` with `eventID` starting `calendly-`. Refresh → no second `Schedule`.
2. Meta Events Manager → Test events: the `Schedule` shows with `content_name = direct-booking-design-call`.
3. GA4 DebugView: `cd_dbl_section_view` fires once per section, `cd_dbl_cta_click` carries the right `cta_location`, `generate_lead` fires once.
4. Calendly: the test invitee shows `utm_source/medium/campaign/content/term` and the `salesforce_uuid` value from the URL you tested with (use `?utm_source=test&utm_content=ad-a&fbclid=abc123`). Cancel the test booking afterwards.
5. Sticky CTA: hidden on desktop; on mobile appears after the hero, hides over `#book`, gone after booking.
6. With Calendly's domain blocked in DevTools: fallback link renders, page otherwise intact, no console errors.

### 5.5 Phase 2 (separate ticket — do not build now)

Calendly webhook `invitee.created` → Netlify function `/api/calendly-webhook` → Meta Conversions API `Schedule` with `event_id = calendly-<inviteeId>`, hashed email (and phone if collected), `fbc` from `tracking.salesforce_uuid`, `event_source_url` = lander URL, plus optional HubSpot contact upsert. This recovers bookings the browser pixel loses (iOS, blockers) and dedupes cleanly because the `event_id` is identical on both sides.

---

## 6. Performance budget

| Metric | Target | How |
|--------|--------|-----|
| Lighthouse mobile (Moto G / slow 4G) | Performance ≥ 90, LCP ≤ 2.0 s, CLS < 0.05 | Hero image ≤ 120 KB and `priority`; nothing else above the fold loads images |
| Route JS | No GSAP, no framer-motion, no HubSpot form code, no reCAPTCHA | §1.2, §2.5; check `next build` route size |
| Third parties on load | gtag + pixel only | Calendly loads on demand (§4.3) |
| Fonts | No new fonts | Nohemi 300 already preloaded in layout; use weight 400 only if it's already in the CSS `@font-face` list (it is) |

Run `npx tsc --noEmit` and `npm run lint` before every push (repo rule). Run `npm run build` once before the PR and paste the `/direct-booking` route size into the PR description.

---

## 7. Acceptance checklist

- [ ] `/direct-booking` renders with no navbar, no footer, no modal providers' UI, no reCAPTCHA script.
- [ ] `<meta name="robots" content="noindex, nofollow">` present; route absent from `sitemap.xml`.
- [ ] 375 px: no horizontal scroll; hero CTA visible without scrolling; every tap target ≥ 44 px.
- [ ] All copy comes from `copy.ts`; no brief/production notes leaked into UI (repo rule `customer-facing-copy.mdc`).
- [ ] Four CTAs (hero, after math, after catch, sticky) share one text constant and all land on `#book`.
- [ ] Calculator: default `$50,000 → ≈ $7,750`; `$100,000 → ≈ $15,500`; keyboard-operable.
- [ ] FAQ: one open at a time, `aria-expanded` correct, `cd_dbl_faq_open` fires.
- [ ] Booking: skeleton → widget; time pick → question step → confirmation; "You're booked" block swaps in; sticky hides; refresh keeps booked state without re-firing events.
- [ ] Tracking verification §5.4 all pass, screenshots attached to PR.
- [ ] Lighthouse mobile report attached to PR; LCP element is the hero image.
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build` all clean.
- [ ] Netlify env set: `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_CALENDLY_EVENT_URL`; both added to `SECRETS_SCAN_OMIT_KEYS`.

## 8. Do not

- Do not add a lead form, email capture, exit-intent modal, chat widget, or any link off the page besides `/privacy`.
- Do not put a price anywhere.
- Do not fire `Lead`, or fire `Schedule` on page load, CTA click, or time selection.
- Do not use Calendly's redirect-after-booking.
- Do not import `FAQSection`, `CTAButton`, `ShorePartnershipChrome`, or anything from `@/components/shore-partnership`.
- Do not invent statistics, testimonials, or client names.

## 9. Open items for Jordan (consolidated)

1. Final ad headline + primary text + Meta CTA button (recommend **Book Now**), so the H1 and page CTA can be locked.
2. Calendly event URL, with the five invitee questions set up as in §4.1, and the text-reminders decision.
3. Meta Pixel ID.
4. Hero image from the ad (and the 1200×628 OG crop). Exact CTA hex if it isn't `#FF5501`.
5. Confirmation that the North Star Nature Suites name and the two stats can be used on this page.
6. URL: `/direct-booking` OK?
7. Ads Manager URL parameters from §5.3 applied to the ad.
