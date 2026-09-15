/**
 * Every customer-facing string on /direct-booking. Nothing else in the lander
 * hard-codes visible text, so a copy change is a one-line edit here.
 */

export const CTA_TEXT = 'Book my 15-minute call';

export const TRUST_LINE =
  'No sales pitch on the call. The design is yours whether you work with us or not.';

export const HERO = {
  eyebrow: 'For multi-unit unique stays — glamping, domes, cabins, tiny homes',
  /** Phone-width eyebrow; the full line wraps to two on 390px. */
  eyebrowShort: 'For multi-unit unique stays',
  h1FirstSentence: "Airbnb's cut is 15.5% now.",
  /** Rendered in orange inside h1FirstSentence. Must be a substring of it. */
  h1Highlight: '15.5%',
  h1SecondSentence: 'Your own booking site takes nothing.',
  subhead:
    "We'll design a direct booking website for your property, free. It's yours to keep. All it takes is a 15-minute call so the design fits how you actually take bookings.",
  /** Phone-width subhead: the offer in one sentence so the button stays on the first screen. */
  subheadShort: "We'll design your direct booking website, free. It's yours to keep.",
} as const;

export const HOW_IT_WORKS = {
  eyebrow: 'How it works',
  steps: [
    {
      numeral: '01',
      title: 'Book a 15-minute call',
      body: "Pick a time that works. Tell us about your property, how you take bookings now, and what's frustrating you.",
    },
    {
      numeral: '02',
      title: 'We design your booking site',
      body: 'About a week later, we walk you through a design built for your property — your photos, your units, your booking flow.',
    },
    {
      numeral: '03',
      title: "It's yours",
      body: 'You get the full design of your homepage and booking flow as a PDF and image files any developer can build from. Build it yourself, hire whoever you want, or ask us to build and run it. No obligation either way.',
    },
  ],
} as const;

export const AIRBNB_HOST_FEE_RATE = 0.155;

export const FEE_MATH = {
  eyebrow: 'The math',
  h2: 'What 15.5% actually costs you',
  body: 'If you do $50,000 a year through Airbnb, about $7,750 of it is fees. Every guest who rebooks with you directly is a booking you keep all of. Most operators we talk to already have repeat guests who\u2019d happily book direct. They just don\u2019t have a site worth sending them to.',
  calculatorLabel: 'Your annual bookings through Airbnb',
  calculatorSuffix: 'a year in Airbnb fees',
  calculatorFootnote: "Based on Airbnb's 15.5% host-only service fee.",
} as const;

export const CALL_AGENDA = {
  eyebrow: 'The call',
  h2: 'What the call is actually for',
  intro: "We're not going to pitch you. We're going to ask:",
  questions: [
    'Where you manage your calendar and bookings today — Airbnb only, Vrbo, a booking system?',
    "Whether you have a website, and if so, what's wrong with it",
    'How many units you have and what makes them different',
    'What a guest goes through today if they want to book direct',
    "What you'd want the site to do that it doesn't do now",
  ],
  close:
    "That's it. Fifteen minutes, maybe twenty if you're chatty. We use it to design something that fits your property instead of a generic template.",
} as const;

export const PROOF = {
  eyebrow: "Who you're talking to",
  h2: "We've done this for unique stays before",
  body: "We're a Nashville agency that builds websites and runs ads for hospitality businesses, including unique stays. We know the booking platforms — which ones sync with Airbnb and Vrbo without double-booking, which ones let guests book without leaving your site. We've looked at a lot of glamping websites. Most of them are losing bookings they don't know about.",
} as const;

/** One object so a campaign-launched site can replace it without touching the component. */
export const PROOF_CARD = {
  name: 'North Star Nature Suites',
  descriptor: 'luxury cabin suites, Tennessee',
  caption: 'Direct booking site designed and built by Captive Demand',
  image: '/northstarnaturesuites.png',
  imageAlt: 'North Star Nature Suites direct booking website',
  /** Shown in the browser-frame address pill; display only, not a link. */
  url: 'northstarnaturesuites.com',
  stats: [
    { value: '+289%', label: 'direct bookings' },
    { value: '−60%', label: 'OTA dependency' },
  ],
} as const;

export const THE_CATCH = {
  eyebrow: 'Straight answer',
  h2: "So what's the catch?",
  body: "There isn't one, but here's the honest version. We design the site free because some people who see the design want us to build it and run it for them. That's a paid monthly service, and we'll tell you exactly what it costs on the second call — not before, and not by surprise. If you'd rather take the design somewhere else, that's fine. You'll still have a design that's better than what you've got.",
} as const;

/** Who is on the other end of the call. Shown right above the calendar. */
export const HOST_CARD = {
  eyebrow: "Who you'll be talking to",
  name: 'Jordan Schneider',
  role: 'CMO, Captive Demand',
  line: "Jordan hosts on Airbnb himself. The 15.5% on this page is from his own account, and he's the one on the call and the design walkthrough. No handoff to a sales team.",
  photo: '/Jordan.jpeg',
  photoAlt: 'Jordan Schneider',
} as const;

export const BOOKING = {
  eyebrow: 'Pick a time',
  h2: 'Pick a time',
  trustLine: '15 minutes. No pitch. The design is yours to keep.',
  fallbackLink: 'Calendar not loading? Open it in a new tab.',
  booked: {
    eyebrow: "You're booked",
    h2: "You're booked.",
    body: "A calendar invite with the video link is on its way to your inbox. On the call we'll ask about your property and how you take bookings today. About a week later we'll walk you through the design.",
    prepLine:
      "One thing to have handy: a link to your current website or Airbnb listing, if you didn't add it on the form.",
  },
} as const;

export const BOOKING_PLATFORM_OPTIONS = [
  'Airbnb only',
  'Airbnb + Vrbo',
  'A booking system (Hostaway, Guesty, Beds24, Lodgify, etc.)',
  'Something else',
] as const;

export const UNIT_COUNT_OPTIONS = ['1–2', '3–5', '6–10', '10+'] as const;

export const PREP = {
  eyebrow: 'Help us prep — 30 seconds',
  leadLine: 'Two quick taps and a link, so the design fits your property.',
  bookingPlatformLabel: 'How do you take bookings today?',
  unitCountLabel: 'How many units?',
  siteLinkLabel: 'Link to your website or Airbnb listing',
  siteLinkPlaceholder: 'airbnb.com/h/your-place or yourproperty.com',
  siteLinkHint: 'We use it to see your photos and units before the call.',
  phoneLabel: 'Best number for a reminder text',
  phonePlaceholder: '(615) 555-0123',
  phoneHint: 'Optional. One text the day before, nothing else.',
  submit: 'Send',
  success: 'Got it. See you on the call.',
  skip: 'Skip for now',
} as const;

export const FAQ = {
  eyebrow: 'Questions',
  h2: 'Before you book',
  items: [
    {
      question: 'Do I need a website already?',
      answer:
        "No. Most people we talk to either don't have one or have one they're embarrassed by. Either is fine.",
    },
    {
      question: 'I only use Airbnb. Does this still make sense?',
      answer:
        "Yes — that's the most common situation. We'll talk through what it takes to add direct booking alongside Airbnb without double-booking.",
    },
    {
      question: 'Is the design really free?',
      answer: 'Yes. You keep it: the full design of your homepage and booking flow, delivered as a PDF and image files any developer can build from. No card, no contract.',
    },
    {
      question: 'What if I want you to build it?',
      answer: "We'll tell you what that costs on the second call. It's a monthly service. No pressure.",
    },
    {
      question: 'How long until I see the design?',
      answer: 'About a week after the first call.',
    },
  ],
} as const;

export const FOOTER = {
  location: 'Nashville, TN',
  privacyLabel: 'Privacy',
  privacyHref: '/privacy',
  copyright: '© 2026 Captive Demand',
  logo: '/captive-demand-logo.png',
  logoAlt: 'Captive Demand',
} as const;

export const SEO = {
  title: 'Free direct booking site design for unique stays',
  description:
    'Airbnb takes 15.5%. We design a direct booking website for your glamping, dome, cabin, or tiny-home property, free. Starts with a 15-minute call.',
} as const;
