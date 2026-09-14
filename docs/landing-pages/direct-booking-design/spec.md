# Build Spec — Direct Booking Design Lander (`/direct-booking`)

**Status:** Ready to build. Items tagged `⚠ JORDAN` need confirmation before **launch**, not before build — build against the defaults given.
**Companion:** `brief.md` in this folder (the original campaign brief). This spec wins where the two disagree.
**Branch:** `claude/loving-mccarthy-nwwpzd` (spec) → build on a `cursor/*` branch off `main`.
**Last updated:** 2026-09-14 (rev 7: staying on the free HubSpot tier; qualifying questions move to the post-booking prep step, §4.5)

---

## 0. Decisions from the strategy workshop

| # | Decision | Default to build | Status |
|---|----------|------------------|--------|
| 1 | URL | `/direct-booking` | ⚠ JORDAN |
| 2 | Scheduling tool | **HubSpot Meetings** on the **free tier**, inline embed of a **dedicated** scheduling page under Jordan's account (not his general `meetings.hubspot.com/jordan1473` link). The HubSpot form stays at first name / last name / email. The qualifying questions are a **post-booking prep step on our page** (§4.5) that writes answers onto the HubSpot contact through our API route. No pre-form step before the calendar. | Decided |
| 3 | Meta conversion event | `Schedule` (standard event), fired **client-side** on HubSpot's `meetingBookSucceeded` message, with a client-generated `eventID` that is also stored on the HubSpot contact so a server-side Conversions API event can dedupe against it later. `Lead` is **not** fired on this page. | Decided |
| 4 | Tag layer | **Google Tag Manager.** The page pushes semantic `dataLayer` events only; it never calls `fbq()` or `gtag()` itself. GTM fires the Meta Pixel `Schedule` and the GA4 event tags. The existing `GoogleTagManager` component gets mounted in the root layout (env-gated). | Decided |
| 5 | Meta Pixel | Lives in the GTM container `GTM-KDGH9S9` (already does, per Jordan). Base + PageView on all pages via GTM; `Schedule` only from this route's `cd_dbl_call_booked` dataLayer event. | Container ID decided; tag setup in §5.1 still to do |
| 6 | Attribution passthrough | UTMs + `fbclid` captured on landing, persisted in `sessionStorage`. After a booking, the page POSTs them with the booker's email to a small API route that stamps them onto the HubSpot contact the booking just created. | Decided |
| 7 | Confirmation state | Stays on-page. HubSpot's own confirmation screen stays inside the embed (and HubSpot sends a real calendar invite from Jordan's connected calendar); we swap the copy **above** the embed to a "You're booked" block. | Decided |
| 8 | Proof section | North Star Nature Suites (luxury cabin suites, TN) — a direct booking site we designed and built, with the two stats already published on `/services/seo`. Confirmed legitimate by Jordan. Built as one data object so it can be swapped for campaign-launched sites later. | Decided |
| 9 | Calculator | Yes. One slider, one output. | Decided |
| 10 | Phone number | Optional field in the post-booking prep step (§4.5). Zero cost to the booking itself; gives a way to text no-shows when provided. | Decided |
| 11 | Chrome | No nav, no footer links except Privacy, logo **not** linked. No exit-intent modal, no chat FAB, no separate lead form. | Decided |
| 12 | Motion | CSS-only reveals. No GSAP, no framer-motion on this route. | Decided |
| 13 | Hero image | The dome-at-dusk image from the live ad. | ⚠ JORDAN (asset) |

---

## 1. Route, chrome, and SEO

### 1.1 Files

```
src/app/direct-booking/page.tsx                       # server component, metadata, viewport
src/app/api/direct-booking/booked/route.ts            # stamps attribution onto the HubSpot contact (§5.3)
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
  HubSpotMeetingsInline.tsx                           # embed + postMessage listener (client)
  Faq.tsx                                             # accordion (client)
  StickyCta.tsx                                       # mobile-only (client)
  LanderFooter.tsx
  SectionViewTracker.tsx                              # IntersectionObserver → GA4 (client)
  AttributionCapture.tsx                              # runs captureAttribution() once (client)
src/lib/direct-booking-lander.ts                      # path const, meeting URL resolver, event names, trackLander() → dataLayer
src/lib/attribution.ts                                # UTM / fbclid capture, fbc derivation
src/lib/standalone-landers.ts                         # generalises isShorePartnershipPath
src/components/analytics/GoogleTagManager.tsx         # EXISTS — mount it in layout.tsx, change strategy (§5.1)
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

- Do **not** add the route to `src/app/sitemap.ts`, to `crawlableSiteLinks` in `layout.tsx`, or to any nav/footer. The only way in is the ad URL.
- `robots.ts` needs no change (noindex is on the page).
- Belt and braces: add an `X-Robots-Tag: noindex, nofollow` header for `/direct-booking` in `netlify.toml` (a `[[headers]]` block like the cache ones already there).

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
- `onClick`: `trackLander('cd_dbl_cta_click', { cta_location: location })` → `document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' })` → `window.dispatchEvent(new CustomEvent('cd-dbl:load-scheduler'))`. Respect `prefers-reduced-motion` (use `behavior: 'auto'`).
- Same text everywhere: the `CTA_TEXT` constant from `copy.ts`.

### 2.3 Hero

- Full-bleed image (`next/image`, `fill`, `object-cover`, `priority`, `sizes="100vw"`, `quality={75}`), dark gradient overlay `from-[#1a1512]/40 via-[#1a1512]/75 to-[#1a1512]` bottom-heavy so text sits on near-solid ink.
- Asset: `/public/direct-booking/hero.jpg` — ⚠ JORDAN supplies the ad image. Export at 1600 px wide, target **≤ 120 KB** (run `scripts/optimize-public-images.mjs` or export AVIF/WebP). Also export a 800 px mobile crop if the composition needs it; use `<picture>`-style `sizes` rather than two components.
- Above-the-fold check: eyebrow, H1, subhead, CTA, and trust line must all be visible without scrolling on a **390×844** viewport; the CTA itself must be visible on **375×667**.
- Hero is the LCP element. Nothing else on the page may be `priority`.

### 2.4 Sticky CTA (mobile only, `md:hidden`)

- Fixed bottom bar, `bg-[#1a1512]/92 backdrop-blur-md border-t border-white/10`, padding `px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]`.
- Shows when the hero has scrolled out of view. Hides while the booking section is in view and permanently after a booking. One `IntersectionObserver` for the hero, one for `#book`.
- Slides in/out with a CSS transform transition. Never overlaps the scheduler's own buttons (that's why it hides over `#book`).

### 2.5 Reveals

Sections fade/translate in on first intersection using a `[data-reveal]` attribute + one small client component that toggles a class. `prefers-reduced-motion: reduce` → no transform, opacity only. No animation library.

---

## 3. Page sections and copy

Everything in the **Ships** blocks is customer-facing and goes into `copy.ts` verbatim. Anything labelled *Build note* is for you, never for the page. The ad copy leads with Airbnb's 15.5% fee and nothing else, so the hero below is locked; ad copy is not a blocker. Keep each hero line as its own constant anyway so a last-minute word change is a one-line edit.

### 3.1 Hero

**Ships**

- Eyebrow: `For multi-unit, unique stays — glamping, domes, cabins, tiny homes`
- H1: `Airbnb's cut is 15.5% now. Your own booking site takes nothing.`
- Subhead: `We'll design a direct booking website for your property, free. It's yours to keep. All it takes is a 15-minute call so the design fits how you actually take bookings.`
- CTA: `Book my 15-minute call`
- Trust line (directly under the button): `No sales pitch on the call. The design is yours whether you work with us or not.`

*Build note:* the H1's first sentence echoes the ad's 15.5% hook on purpose. If the final ad phrases it differently at launch, change only the first sentence to match; leave the second sentence, subhead, and CTA alone.

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
  - Stat chips: `+289% direct bookings` · `OTA dependency down 60%`

*Build note:* the two stats come from `SEOCaseStudies.ts` and Jordan has confirmed the case study is legitimate. Define the card as one `PROOF_CARD` object in `copy.ts` (`name`, `descriptor`, `image`, `stats[]`) so it can be swapped for a site launched from this campaign later without touching the component. Do not add any other testimonial, logo wall, or quote.

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
- Embed below, inside a light panel (`bg-[#FAF9F6] rounded-2xl p-2 sm:p-3`) because HubSpot's scheduler renders on white and can't be themed dark.
- Fallback link (only rendered if the HubSpot embed script fails to load): `Calendar not loading? Open it in a new tab.` → the scheduling page URL (without `embed=true`), `target="_blank" rel="noopener"`.

**Ships — after booking (replaces the three lines above; embed stays visible)**

- Eyebrow: `You're booked`
- H2: `You're booked.`
- Body: `A calendar invite with the video link is on its way to your inbox. On the call we'll ask about your property and how you take bookings today. About a week later we'll walk you through the design.`
- Prep line: `One thing to have handy: a link to your current website or Airbnb listing, if you didn't add it on the form.`

*Build note:* HubSpot shows its own confirmation inside the iframe and sends a real calendar invitation from Jordan's connected Google calendar (that's the "add to calendar" the brief asks for — it lands in their calendar automatically). Don't rebuild it. After booking, `scrollIntoView` the section heading so the "You're booked" block and the top of the confirmation are both on screen.

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

## 4. HubSpot Meetings

### 4.1 Scheduling page setup (Jordan, in HubSpot — not code) ⚠ JORDAN

**Tier:** the portal is on the free tier and stays there. Adding questions to a scheduling page's form is a paid Sales Hub / Service Hub feature, so the HubSpot form is fixed at First name / Last name / Email (confirmed on Jordan's portal after the Sales Hub Professional trial ended). The qualifying questions are collected by §4.5 instead. Two free-tier consequences to accept: the scheduling page shows HubSpot branding inside the embed, and reminder emails may not be available (check the Automation / Additional settings area; if there's no reminder toggle, that's the tier).

Create a **new** scheduling page rather than reusing the general `jordan1473` link, so this campaign's bookings have their own form questions and their own reporting:

- Sales → Meetings → Create scheduling page → One-on-one, Jordan as organizer.
- Internal name `Direct booking site design call`; slug e.g. `direct-booking-design` → URL `https://meetings.hubspot.com/jordan1473/direct-booking-design`.
- Duration 15 min only. Location: Google Meet (or phone — his call). Title shown to invitees: `Direct booking site design — 15 min`.
- **Form tab:** leave it alone (first name, last name, email). Leave CAPTCHA off (it adds a step on mobile and the page is only reachable from the ad), leave "block free email domains" **off** (glamping operators book with Gmail), guests off, consent off.
- **Contact properties the prep step writes to** (create under Settings → Properties, object Contacts, group "Direct booking lander"; the property types only matter for reporting since our page renders the controls):
  1. `property_name` — single-line text
  2. `booking_platform` — Radio select or Dropdown select, options: `Airbnb only` / `Airbnb + Vrbo` / `A booking system (Hostaway, Guesty, Beds24, Lodgify, etc.)` / `Something else`
  3. `unit_count` — Radio select or Dropdown select, options: `1–2` / `3–5` / `6–10` / `10+`
  4. `airbnb_annual_bookings` — Radio select or Dropdown select, options: `Under $25k` / `$25–50k` / `$50–100k` / `$100k+` / `Prefer not to say`
  5. `booking_site_link` — single-line text (**not** URL type)
  Phone uses the default `phone` property. **The option strings must match §4.5 exactly**, because the API route writes the page's radio values straight into these enumeration properties and HubSpot rejects values that aren't defined options.
- Reminder emails: turn on 24 h and 1 h before if the tier offers the toggle.
- Availability: minimum notice 4 h, booking window 14 days, 15-min buffer after. (Show-rate hygiene; his call.)
- Confirmation: HubSpot default. There is no redirect setting to worry about.
- Also create these **contact properties** (single-line text unless noted) for the attribution stamp in §5.3. `utm_source`, `utm_medium`, `utm_campaign` already exist in the portal (the audit form writes them). New: `utm_content`, `utm_term`, `fbclid`, `meta_fbc`, `meta_event_id`, `booked_call_source` (dropdown, one option `direct-booking-lander`), `booked_call_at` (date-time).

*Build note:* the brief's "Do you have a website? (No / Yes — enter URL)" became the single optional link field in the prep step; no conditional field needed.

### 4.2 Config

- `NEXT_PUBLIC_HUBSPOT_MEETING_URL` — the scheduling page URL **without** `?embed=true`, e.g. `https://meetings.hubspot.com/jordan1473/direct-booking-design`. Add to `.env.example` and Netlify env.
- Resolver in `src/lib/direct-booking-lander.ts`:

```ts
export function resolveMeetingUrls(): { page: string; embed: string } | null {
  const raw = process.env.NEXT_PUBLIC_HUBSPOT_MEETING_URL?.trim();
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (u.hostname !== 'meetings.hubspot.com' && !u.hostname.endsWith('.hubspot.com')) return null;
    u.searchParams.delete('embed');
    const page = u.toString();
    u.searchParams.set('embed', 'true');
    return { page, embed: u.toString() };
  } catch {
    return null;
  }
}
```

  If the resolver returns `null`, render the booking section with a visible dev-only warning and no embed (never ship an empty section silently — `console.error` in dev; the fallback link is hidden because there is no URL).

- Netlify: append `NEXT_PUBLIC_HUBSPOT_MEETING_URL` and `NEXT_PUBLIC_GTM_CONTAINER_ID` to `SECRETS_SCAN_OMIT_KEYS` in `netlify.toml` (they're `NEXT_PUBLIC_*`, so they get inlined into bundles and the secrets scanner will flag them exactly as it did for the reCAPTCHA key).

### 4.3 Loading the embed (`HubSpotMeetingsInline`, client)

HubSpot's official snippet is a container div plus a script that scans the DOM once, injects the iframe, and keeps its height in sync:

```html
<div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/jordan1473/direct-booking-design?embed=true"></div>
<script src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"></script>
```

In React, render the container **first**, then inject the script **once, on demand**. Trigger: the booking section enters a `rootMargin: '800px 0px'` observer **or** the `cd-dbl:load-scheduler` custom event fires (any CTA click), whichever first. The script only scans on load, so the container must be in the DOM before it runs, and it must never be injected twice:

```ts
let hsEmbedLoad: Promise<void> | null = null;
export function loadHubSpotMeetingsEmbed(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('ssr'));
  if (!hsEmbedLoad) {
    hsEmbedLoad = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('hubspot-meetings-script'));
      document.head.appendChild(s);
    });
  }
  return hsEmbedLoad;
}
```

- Container: `<div className="meetings-iframe-container w-full" data-src={embedUrl} />` inside a wrapper with `min-h-[640px]`. HubSpot's script resizes the iframe itself; keep a skeleton (`animate-pulse` panel) visible until the iframe element appears (watch with a `MutationObserver` on the container, or poll `container.querySelector('iframe')` on the script's `onload`).
- Fire `cd_dbl_calendar_loaded` when the iframe's `load` event fires.
- HubSpot posts no "time selected" message, so use the standard cross-origin proxy: on `window` `blur`, if `document.activeElement` is the scheduler iframe, fire `cd_dbl_calendar_engaged` once. It's a proxy for "started interacting with the calendar", not a time pick — label it that way in GA4.
- If `loadHubSpotMeetingsEmbed()` rejects (ad blocker / network), show the fallback link from §3.7.
- HubSpot's meeting iframe is fixed white; the light panel from §3.7 frames it so it doesn't look like a hole in the dark page.

### 4.4 Listening for bookings (the part that feeds the pixel via GTM)

The scheduler iframe posts a message to the parent window when a meeting is booked. Listen once, at the `HubSpotMeetingsInline` level:

```ts
useEffect(() => {
  function onMessage(e: MessageEvent) {
    if (e.origin !== 'https://meetings.hubspot.com') return;
    const data = e.data;
    if (!data || typeof data !== 'object' || data.meetingBookSucceeded !== true) return;

    const payload = data.meetingsPayload ?? {};
    const contact = payload.bookingResponse?.postResponse?.contact ?? {};
    onScheduled({
      email: typeof contact.email === 'string' ? contact.email : undefined,
      firstName: contact.firstName,
      lastName: contact.lastName,
      startTime: payload.bookingResponse?.event?.dateString,   // verify exact field during QA
      meetingSlug: payload.userSlug,
      formGuid: payload.formGuid,
    });
  }
  window.addEventListener('message', onMessage);
  return () => window.removeEventListener('message', onMessage);
}, [onScheduled]);
```

*Build note:* the payload shape is documented by HubSpot users rather than HubSpot itself. `meetingBookSucceeded`, `meetingsPayload.bookingResponse.postResponse.contact.email`, `userSlug`, and `formGuid` are well attested. On the first test booking, `console.log(JSON.stringify(e.data))` once, pin the field paths you actually see, and delete the log. Treat every field as optional; only `meetingBookSucceeded === true` is required to count the booking.

`onScheduled` (in `BookingSection`) runs **exactly once** per page life (guard with a ref and `sessionStorage['cd_dbl_booked']`):

```ts
const eventID = `cd-dbl-${crypto.randomUUID()}`;

// One dataLayer event; GTM fans it out to the Meta Pixel `Schedule` tag and the GA4 `generate_lead` tag (§5.1).
trackLander('cd_dbl_call_booked', {
  meta_event_id: eventID,
  lead_source: 'hubspot_meetings',
  meeting_slug: meetingSlug ?? '(unknown)',
});

setBooked(true);
sessionStorage.setItem('cd_dbl_booked', '1');
document.getElementById('book')?.scrollIntoView({ block: 'start' });

// Attribution stamp — fire and forget, never blocks the UI (see §5.3)
void postBookingAttribution({ email, eventID, startTime, meetingSlug, attribution: getAttribution() });
```

The `eventID` is generated here, handed to GTM as `meta_event_id` (the Pixel tag passes it as `eventID`), and written onto the HubSpot contact by the API route, so a later server-side Conversions API event can send the same id and Meta will dedupe (§5.5).

If `sessionStorage['cd_dbl_booked']` is already `'1'` on mount (they refreshed after booking), render the booked state and **do not** fire the events again.

### 4.5 Post-booking prep step (IN SCOPE — this is where the qualifying questions live)

The HubSpot form stays at name + email (the smallest possible ask at the conversion point) and the qualifying answers are collected in our own UI right after the booking, when the person has already committed. Expect some bookers to skip it; that is the trade for a cheaper booking, and the skip rate is a metric we report.

**Flow**

1. `meetingBookSucceeded` → everything in §4.4 happens exactly as written (`cd_dbl_call_booked`, booked state, attribution POST).
2. The "You're booked" block (§3.7) gains a short form directly beneath its copy, above the HubSpot confirmation iframe, so it is the first thing on screen after the scroll. Heading and fields:

   **Ships**
   - Eyebrow: `Help us prep — 30 seconds`
   - Lead line: `Four quick taps so the design fits your property.`
   - `Property name` — single-line text, required
   - `How do you take bookings today?` — radio: `Airbnb only` / `Airbnb + Vrbo` / `A booking system (Hostaway, Guesty, Beds24, Lodgify, etc.)` / `Something else` — required
   - `How many units?` — radio: `1–2` / `3–5` / `6–10` / `10+` — required
   - `Rough annual bookings through Airbnb` — radio: `Under $25k` / `$25–50k` / `$50–100k` / `$100k+` / `Prefer not to say` — required
   - `Link to your website or Airbnb listing` — single-line text, optional
   - `Best number for a reminder text` — tel input, optional (decision #10)
   - Submit button: `Send`
   - Success state (replaces the form): `Got it. See you on the call.`
   - Skip link under the button, muted: `Skip for now`

   Radios are large tap targets (full-width rows, ≥ 48 px tall, `aria-checked` on `role="radio"` buttons or native inputs with visually-large labels). Same panel/accent tokens as §2.1. No validation beyond required-ness; never block on the link or phone format.
3. On submit → `POST /api/direct-booking/booked` again with the **same `eventId`** and an `answers` object: `{ property_name, booking_platform, unit_count, airbnb_annual_bookings, booking_site_link, phone }`. The route (§5.3) patches those properties onto the contact under the same 15-minute guard. `phone` maps to HubSpot's default `phone` property; the rest map to the custom properties from §4.1.
4. Fire `cd_dbl_prep_submitted` on success and `cd_dbl_prep_skipped` on skip (both are in the §5.2 table and the GTM regex trigger).
5. Persist a `cd_dbl_prep_done` flag in `sessionStorage` so a refresh shows the success state, not the empty form.

**Server change:** the route accepts an optional `answers` object; each value is a string ≤ 200 chars; radio values are validated against the option lists above (reject anything else with 400). The attribution stamp on the first call and the answers patch on the second are independent, so either can arrive without the other.

**Reading the numbers:** report "prep form completion" (`cd_dbl_prep_submitted` ÷ `cd_dbl_call_booked`) as its own metric next to show rate. If completion is low, the first lever is the lead line copy, the second is cutting the revenue question.

---

## 5. Tracking

### 5.1 Google Tag Manager (the only tag layer on this page)

**Code side (small):**

- Container: **`GTM-KDGH9S9`**. Follow the GA4 pattern in `src/lib/site.ts`: add `gtmContainerId: "GTM-KDGH9S9"` to `siteConfig`, and have `GoogleTagManager.tsx` resolve `NEXT_PUBLIC_GTM_CONTAINER_ID` first and fall back to that default (mirror `resolvedMeasurementId()` in `SiteGoogleAnalytics.tsx`). No Netlify env is required for GTM to run in production; the env var stays as an override.
- Mount the existing `GoogleTagManager` component in `src/app/layout.tsx` as the **first child of `<body>`**, ahead of the reCAPTCHA provider. Its inline script already matches Jordan's GTM snippet byte for byte, and rendering it first puts the `<noscript>` iframe immediately after the opening `<body>` tag, which is where GTM asks for it. It still skips dev unless `NEXT_PUBLIC_GTM_IN_DEV=true`.
- Change its `next/script` strategy from `lazyOnload` to **`afterInteractive`**. GTM's instructions say "as high in the `<head>` as possible"; `afterInteractive` is Next's recommended equivalent for tag managers (it injects the script right after hydration), whereas `lazyOnload` waits for the window `load` event, which on an ad lander means the Pixel `PageView` fires late or not at all for people who bounce in two seconds. Events pushed before GTM loads are queued in `window.dataLayer`, so nothing is lost either way, but PageView timing matters. Do not use `beforeInteractive`; it delays hydration for a script that doesn't need to block.
- Add `NEXT_PUBLIC_GTM_CONTAINER_ID=` (commented, override only) to `.env.example`, and add the key to `SECRETS_SCAN_OMIT_KEYS` so an override set in Netlify doesn't trip the secrets scanner.
- `trackLander(event, params)` in `src/lib/direct-booking-lander.ts` wraps `pushDataLayerEvent` from `@/lib/analytics` and adds `page_variant: 'direct-booking-v1'` to every push. **Nothing on this route calls `gtag()` or `fbq()` directly**, and nothing on this route uses `trackGa4Event` (it would double-send once GTM forwards the same event to GA4).

**GA4 double-counting guard (site-wide, must be settled before launch):** the site already loads GA4 via `SiteGoogleAnalytics` (gtag, `G-N2HFM02GMY`). If the GTM container also has a Google tag / GA4 configuration firing on All Pages, every page will send two `page_view`s once GTM is mounted. Pick one:

- **Default for this build:** keep `SiteGoogleAnalytics` for page views; in GTM, set the Google tag's *"Send a page view event when this configuration loads"* to **off** (`send_page_view: false`). GTM then only sends the custom events below. Same measurement ID on both, same `_ga` cookie, sessions stitch.
- Alternative: remove `SiteGoogleAnalytics` and let GTM own GA4 entirely. Cleaner long-term, but then the main site's existing `trackGa4Event` calls (pricing modal, forms) fall back to bare dataLayer pushes and each needs a GTM tag. Out of scope unless Jordan asks.

**Container side (`GTM-KDGH9S9`, Jordan / whoever owns the container) ⚠ JORDAN — tags, triggers, variables to add:**

| Item | Type | Config |
|------|------|--------|
| Meta Pixel base | already in the container | Fires on All Pages. Confirm it also fires on **History Change** if any other part of the site navigates client-side. |
| `DLV - meta_event_id` | Data Layer Variable | `meta_event_id` |
| `DLV - cta_location`, `DLV - section`, `DLV - question`, `DLV - lead_source`, `DLV - page_variant` | Data Layer Variables | same-named keys |
| `CE - cd_dbl_call_booked` | Custom Event trigger | event name `cd_dbl_call_booked` |
| `CE - cd_dbl_*` | Custom Event trigger, regex | `^cd_dbl_(cta_click\|section_view\|calculator_used\|calendar_loaded\|calendar_engaged\|faq_open\|prep_submitted\|prep_skipped)$` |
| Meta – Schedule | Meta Pixel event tag (whatever template the base uses) | Event `Schedule`; object properties `content_name = direct-booking-design-call`, `content_category = unique-stays`; **Event ID = `{{DLV - meta_event_id}}`**; trigger `CE - cd_dbl_call_booked` |
| GA4 – generate_lead | GA4 event tag | event name `generate_lead`; params `lead_source`, `page_variant`; trigger `CE - cd_dbl_call_booked` |
| GA4 – cd_dbl events | GA4 event tag | event name `{{Event}}`; params `cta_location`, `section`, `question`, `page_variant`; trigger `CE - cd_dbl_*` |

Do **not** add a `Lead` tag for this page. Do not fire `Schedule` on any other trigger.

### 5.2 dataLayer events pushed by the page (all through `trackLander`)

| Event | When | Params |
|-------|------|--------|
| `cd_dbl_call_booked` | `meetingBookSucceeded` | `meta_event_id`, `lead_source: 'hubspot_meetings'`, `meeting_slug` |
| `cd_dbl_cta_click` | any primary CTA click | `cta_location: hero \| after_math \| after_catch \| sticky` |
| `cd_dbl_section_view` | a section's first intersection (50% visible) | `section: how \| math \| call \| proof \| catch \| book \| faq` |
| `cd_dbl_calculator_used` | first slider change | — |
| `cd_dbl_calendar_loaded` | scheduler iframe `load` | — |
| `cd_dbl_calendar_engaged` | first focus into the scheduler iframe (blur proxy) | — |
| `cd_dbl_faq_open` | FAQ item opened | `question` (first 60 chars) |
| `cd_dbl_prep_submitted` | prep step (§4.5) submitted successfully | — |
| `cd_dbl_prep_skipped` | prep step skip link | — |

Every push also carries `page_variant: 'direct-booking-v1'`. `cd_dbl_section_view` is the scroll-depth instrument: it gives the funnel the brief wants (hero → how → math → … → book) as named steps instead of percentages. GA4 enhanced measurement already records 90% scroll; leave it on.

⚠ JORDAN (GA4 admin): mark `generate_lead` as a key event and build one exploration: `cd_dbl_section_view` by `section` → `cd_dbl_calendar_loaded` → `cd_dbl_calendar_engaged` → `generate_lead`. That's the four failure modes in the brief, instrumented.

### 5.3 Attribution capture and the booking stamp

**Client — `src/lib/attribution.ts`:**

```ts
export interface Attribution {
  utm_source?: string; utm_medium?: string; utm_campaign?: string;
  utm_content?: string; utm_term?: string;
  fbclid?: string; landing_url?: string; landed_at?: string;
}
const KEY = 'cd_attribution';

/** Call once on mount. Merges URL params over anything stored this session; never throws. */
export function captureAttribution(): Attribution
/** Stored value (or {}). */
export function getAttribution(): Attribution
/** `_fbc` cookie if the pixel already set it, else `fb.1.<now>.<fbclid>` if fbclid exists, else undefined. */
export function getFbc(fbclid?: string): string | undefined
/** `_fbp` cookie if present. */
export function getFbp(): string | undefined
```

Rules: read `window.location.search` on the lander's mount (`AttributionCapture`, rendered once near the top of the page). Persist to `sessionStorage`. A later visit in the same session with **new** UTMs overwrites; a visit with none keeps the stored set. Never prefill name/email into the scheduler; we don't have them.

**Client → server — `postBookingAttribution()`** POSTs JSON to `/api/direct-booking/booked`:

```json
{
  "email": "guest@example.com",
  "eventId": "cd-dbl-…",
  "startTime": "…",
  "meetingSlug": "direct-booking-design",
  "attribution": { "utm_source": "meta", "utm_content": "dome-15pct-v2", "fbclid": "…" },
  "fbc": "fb.1.…",
  "fbp": "fb.1.…",
  "landingUrl": "https://captivedemand.com/direct-booking?utm_…"
}
```

`keepalive: true` on the fetch so it survives a tab close. If the response body is `{ status: 'pending' }`, retry once after 8 s (the contact may not be searchable yet). The prep step (§4.5) calls the same endpoint a second time with an `answers` object added.

**Server — `src/app/api/direct-booking/booked/route.ts`:**

- Reuse `findContactIdByEmail` and `patchContactProperties` from `src/lib/hubspot-form.ts` (export them; they're module-private today). Reuse `isHubSpotConfigured()`; if the token is missing, return `{ status: 'skipped' }` and log.
- Validate: `email` matches a basic email regex, `eventId` matches `^cd-dbl-[0-9a-f-]{36}$`, all strings ≤ 512 chars, body ≤ 8 KB. Reject anything else with 400.
- Search the contact by email. Bump the search to ~5 attempts with 1.5 s backoff (the meeting booking creates the contact asynchronously). Keep total wall time under ~8 s so Netlify's function timeout isn't hit; if still not found, return `{ status: 'pending' }` (client retries once).
- **Guardrail:** request `createdate` and `lastmodifieddate` in the search and only patch if the contact was created or modified in the last **15 minutes**. Otherwise return `{ status: 'skipped' }`. This stops anyone from using the endpoint to rewrite attribution on arbitrary existing contacts.
- Patch, never overwriting a non-empty `utm_source` / `utm_medium` / `utm_campaign` (first touch wins for the properties other forms also write). Always write: `utm_content`, `utm_term`, `fbclid`, `meta_fbc`, `meta_event_id`, `booked_call_source = 'direct-booking-lander'`, `booked_call_at` (ISO now), `captive_demand_form_location = landingUrl`.
- Log failures with `console.error` and return 200 `{ status: 'error' }` — this endpoint must never surface an error to the visitor.

Cost per booked call by creative then reads straight out of HubSpot: contacts with `booked_call_source = direct-booking-lander`, grouped by `utm_content`, against Ads Manager spend by ad. Ads Manager's own `Schedule` count is the cross-check.

⚠ JORDAN (Ads Manager) — set this as the ad's URL parameters so every booking is attributable to a creative (I believe these dynamic placeholders are right; confirm in the URL parameters field):

```
utm_source=meta&utm_medium=paid-social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
```

Meta appends `fbclid` itself.

### 5.4 Verification (do these before calling it done)

1. GTM Preview (Tag Assistant): every `cd_dbl_*` push appears with its params; `cd_dbl_call_booked` fires exactly the Meta `Schedule` tag and the GA4 `generate_lead` tag, and the Schedule tag shows `eventID` starting `cd-dbl-`.
2. Meta Pixel Helper (Chrome): on load exactly one `PageView`; after a test booking exactly one `Schedule`. Refresh → no second `Schedule`. Meta Events Manager → Test events shows it with `content_name = direct-booking-design-call`.
3. GA4 DebugView: exactly **one** `page_view` per load (the double-counting guard in §5.1 is in place), `cd_dbl_section_view` once per section, `cd_dbl_cta_click` with the right `cta_location`, `cd_dbl_calendar_loaded` and `cd_dbl_calendar_engaged` once, `generate_lead` once.
4. HubSpot: land on the page with `?utm_source=test&utm_medium=qa&utm_campaign=c&utm_content=ad-a&utm_term=as&fbclid=abc123`, book a test slot with a throwaway email. Within a minute the contact shows `utm_content = ad-a`, `fbclid = abc123`, `meta_fbc`, `meta_event_id`, `booked_call_source`; then fill in the prep step and confirm `property_name`, `booking_platform`, `unit_count`, `airbnb_annual_bookings`, `booking_site_link`, `phone` land on the same contact. Cancel the meeting and delete the test contact afterwards.
5. Booked state survives refresh without re-firing events.
6. Sticky CTA: hidden on desktop; on mobile appears after the hero, hides over `#book`, gone after booking.
7. With `static.hsappstatic.net` blocked in DevTools: fallback link renders, page otherwise intact, no console errors.

### 5.5 Phase 2 (separate ticket — do not build now)

The `/api/direct-booking/booked` route already has everything the Meta Conversions API needs: `event_id` (same `cd-dbl-…` id the pixel used), hashed email (and phone once the contact is found), `fbc`, `fbp`, client IP + user agent from the request, and `event_source_url`. Adding a CAPI `Schedule` send to that route is ~40 lines plus a `META_CAPI_ACCESS_TOKEN` env var, and Meta will dedupe it against the browser event. This recovers bookings the browser pixel loses (iOS, blockers). Optional in the same ticket: a HubSpot workflow on `booked_call_source = direct-booking-lander` for internal Slack/email alerts.

---

## 6. Performance budget

| Metric | Target | How |
|--------|--------|-----|
| Lighthouse mobile (Moto G / slow 4G) | Performance ≥ 90, LCP ≤ 2.0 s, CLS < 0.05 | Hero image ≤ 120 KB and `priority`; nothing else above the fold loads images |
| Route JS | No GSAP, no framer-motion, no HubSpot form code, no reCAPTCHA | §1.2, §2.5; check `next build` route size |
| Third parties on load | gtag + GTM (and whatever GTM loads: pixel) | HubSpot scheduler loads on demand (§4.3). Audit the container: nothing beyond Pixel + GA4 should fire on this route. |
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
- [ ] Booking: skeleton → scheduler; pick time → form → HubSpot confirmation; "You're booked" block swaps in; sticky hides; refresh keeps booked state without re-firing events.
- [ ] Prep step (§4.5): submits, patches the contact, shows the success state, survives refresh; skip link works; both events fire; radio values match the HubSpot property options exactly.
- [ ] `/api/direct-booking/booked` rejects malformed bodies with 400, skips contacts older than 15 minutes, never returns 5xx to the browser.
- [ ] Tracking verification §5.4 all pass, screenshots attached to PR.
- [ ] Lighthouse mobile report attached to PR; LCP element is the hero image.
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build` all clean.
- [ ] Netlify env set: `NEXT_PUBLIC_HUBSPOT_MEETING_URL` (added to `SECRETS_SCAN_OMIT_KEYS` along with `NEXT_PUBLIC_GTM_CONTAINER_ID`); `HUBSPOT_ACCESS_TOKEN` already present; GTM runs from the `siteConfig` default `GTM-KDGH9S9`.
- [ ] GTM container published with the §5.1 tags; GA4 page views verified single, not double, on the homepage as well as the lander.
- [ ] `X-Robots-Tag` header present on `/direct-booking`; route absent from sitemap, nav, footer, and `crawlableSiteLinks`.

## 8. Do not

- Do not add a separate lead form, email capture, exit-intent modal, chat widget, or any link off the page besides `/privacy`.
- Do not put a price anywhere.
- Do not call `fbq()` or `gtag()` from page code, and do not use `trackGa4Event` on this route; everything goes through `trackLander` → dataLayer → GTM.
- Do not fire `Lead`, or fire `Schedule` on page load, CTA click, or iframe focus.
- Do not add the HubSpot tracking script (`js.hs-scripts.com`) to this page; attribution goes through the API route, and the tracking script is another third-party download the page doesn't need.
- Do not import `FAQSection`, `CTAButton`, `ShorePartnershipChrome`, `GhlBookingCardContent`, or anything from `@/components/shore-partnership`.
- Do not invent statistics, testimonials, or client names.
- Do not put the prep questions before the calendar. They come after `meetingBookSucceeded`, never before.

## 9. Open items for Jordan (consolidated)

1. The new scheduling page URL (Overview + Schedule tabs only; the Form tab stays default) and the six contact properties from §4.1 created with the exact option strings.
2. GTM container changes in §5.1 (Schedule tag with `eventID`, GA4 event tags, and the page-view double-count decision).
3. Hero image from the ad (and the 1200×628 OG crop). Exact CTA hex if it isn't `#FF5501`. Until it arrives, build against a placeholder dark dusk landscape from `/public` (e.g. `desert.png` or `mountain.png`) behind the same gradient, and leave a `TODO(hero-asset)` comment.
4. URL: `/direct-booking` OK?
5. Ads Manager URL parameters from §5.3 applied to the ad.

Settled: ad copy leads with the 15.5% fee (hero locked, §3.1); GTM container is `GTM-KDGH9S9`; North Star Nature Suites proof is approved; HubSpot stays on the free tier with the prep step on our page (§4.5); phone is optional in the prep step.
