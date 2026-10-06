/**
 * Copy for /direct-booking-pms. House rules: no em dashes, sentence case, "free"
 * early, claims stated honestly. Spec: Landing-Page-Spec_DirectBooking-PMS.md.
 */

export const SEO = {
  title: 'Keep your PMS. Get a website worth sending guests to.',
  description:
    'A free custom direct booking website design for hosts on Hostaway, Guesty or OwnerRez. It plugs into the booking system you already use. No migration, no new booking engine.',
};

export const CTA_TEXT = 'Apply for my free design';

export const HERO = {
  eyebrow: 'For hosts on Hostaway, Guesty or OwnerRez',
  h1Lead: 'Keep your PMS.',
  h1Accent: 'Get a website worth sending guests to.',
  sub: "We'll design a custom direct booking website that plugs into the booking system you already use. Free, and the design is yours to keep. No migration, no new booking engine, no rebrand required.",
  microcopy: 'Free to design. Free to build. $100/month to host and support, only if you want it live.',
  beforeLabel: 'What your PMS gives you',
  afterLabel: "What we'll design for you",
  chipSync: { title: 'Calendar synced', detail: 'from your PMS' },
  chipDomain: { title: 'Booked on your domain', detail: 'No percentage to us' },
};

export const PLATFORMS = {
  label: 'Works with',
  names: ['Hostaway', 'Guesty Pro', 'OwnerRez', 'Hospitable', 'Lodgify', 'Hostfully'],
  tail: 'and most PMS with an open API',
};

export const KEEP_REPLACE = {
  eyebrow: 'Keep / replace',
  h2: "Keep everything that works. Replace the part that doesn't.",
  replaceLabel: 'We replace',
  replace: [
    'The template website',
    "The page layout you can't change",
    'The booking flow guests drop out of',
    "The subdomain you couldn't get off of",
  ],
  newSite: 'Your custom direct booking site',
  newSiteTags: ['Your design', 'Your layout', 'A booking flow guests finish', 'Your domain'],
  connector: 'Plugs in through your PMS',
  keepLabel: 'You keep',
  keep: [
    'Your PMS and everything in it',
    'Your calendar, rates and channel sync',
    'Your listings, photos and reviews',
    'Your payments setup',
    'Your name, logo and colors',
    'Your domain',
  ],
  closingLead: 'Your PMS keeps doing the work.',
  closingAccent: "Your website finally looks like the business you've built.",
};

export const FAMILIAR = {
  eyebrow: 'Sound familiar?',
  h2: "What's wrong with the site you have.",
  cards: [
    {
      title: '"It looks like every other template."',
      body: "Your PMS site does the job, but it doesn't look like your business, and you can't change the parts that matter.",
    },
    {
      title: '"I spent a week fighting the builder."',
      body: "Layouts that won't move, settings buried three menus deep, and a custom domain that should have taken five minutes.",
    },
    {
      title: '"I built it and nobody came."',
      body: "A direct site doesn't get traffic by existing. Most PMS sites aren't built to be advertised, and you can't see which bookings your marketing produced.",
    },
    {
      title: '"Now there\'s a fee on top of the fee."',
      body: 'You already pay per listing. Now the better website costs extra, plus a percentage of the bookings it brings in.',
    },
  ],
  closingLead: "None of that is your PMS's fault.",
  closingAccent: 'Booking software is built to run your calendar, not to sell your stays.',
};

export const HOW = {
  eyebrow: 'How it works',
  h2: 'Five steps. The first one takes a minute.',
  steps: [
    {
      when: 'About a minute',
      title: 'Apply in about a minute.',
      body: "Tell us which booking system you use, how many listings you have, and what's wrong with your site today.",
    },
    {
      when: 'Within 2 business days',
      title: 'We review it and email you.',
      body: "We look at your listings and your current site. Within 2 business days you'll hear from us either way. If it's a fit, the email includes a link to book a short call.",
    },
    {
      when: '15 minutes',
      title: 'A 15-minute call.',
      body: "We ask what your site needs to do that it doesn't today. No pitch.",
    },
    {
      when: 'About a week later',
      title: "We design your site. It's yours.",
      body: 'About a week later, we walk you through a custom design for your homepage, property pages and booking flow. You get the files. Take them anywhere, free.',
      tags: ['Free', 'Yours to keep'],
    },
    {
      when: '1 to 2 weeks',
      title: 'If you want it live, we build it free.',
      body: "We build it, connect it to your PMS, and set up your domain. After launch, it's $100/month to host and support in Captive Studio, our CMS, where you can update your site whenever you want.",
      tags: ['Build free', '$100/mo live'],
    },
  ],
};

export const PRICING = {
  eyebrow: 'What it costs',
  h2: 'Two zeros and one flat fee.',
  receiptBrand: 'Captive Demand',
  receiptFor: 'Your website',
  rows: [
    { label: 'Design', price: '$0', note: 'Yours to keep, whether or not you work with us.', accent: true },
    { label: 'Build and launch', price: '$0', note: 'Connected to your PMS, your domain set up for you.', accent: true },
    {
      label: 'Hosting and support in Captive Studio, our agentic no-code CMS',
      price: '$100',
      unit: '/month',
      note: 'Flat. Never a percentage of your bookings. Cancel anytime.',
      accent: false,
    },
  ],
  bookingsShareLabel: '% of your bookings',
  bookingsShare: '0%',
  candor:
    "We'd rather tell you now than surprise you later. The design is free because some people want us to build and run it. If you don't, keep the design and hand it to anyone you like.",
  compare: {
    columns: ['Captive Demand', 'Typical custom agency', 'PMS website add-on'],
    rows: [
      { label: 'Design', values: ['Free, custom', '$5,500 to $10,000+', 'Templates'] },
      { label: 'Monthly', values: ['$100 flat', '$100 to $175, plus engine fees', '$49/month plus 0.5% of bookings'] },
      { label: 'Rebrand or migration', values: ['No', 'Often', 'No'] },
    ],
  },
  footnote:
    "Ranges reflect published pricing from custom STR website agencies and PMS website add-ons as of October 2026. Your PMS's own payment processing fees still apply.",
};

export const TRAFFIC = {
  eyebrow: 'Built by people who send traffic',
  h2: "A direct site needs traffic. That's the part we actually do.",
  body: "We're a Nashville agency that runs ads and SEO for hospitality businesses. We build sites to be advertised: fast pages, a booking flow guests finish, and tracking that sees the booking, so your Meta and Google ads know which guests actually stayed.",
  flow: [
    { label: 'Traffic', text: 'Google, Meta and search', tone: 'light' },
    { label: 'Your site', text: 'Fast pages', tone: 'ink' },
    { label: 'Checkout', text: 'A booking flow guests finish', tone: 'ink' },
    { label: 'Booked', text: 'In your PMS, like always', tone: 'orange' },
  ],
  loop: 'Tracking that sees the booking, sent back to your ads',
  servicesLabel: "Optional, when you're ready",
  services: [
    {
      icon: 'search',
      title: 'SEO for short-term rentals',
      price: '$500',
      intro: 'Get found by guests searching for stays in your area, not just your name.',
      items: [
        'A new SEO blog post every two weeks',
        'Keyword strategy, and on-page optimization of titles, headings and meta descriptions',
        'Ongoing internal linking',
        'Google Business Profile setup and management, including custom posts and review alerts',
        'Automated monthly reports',
      ],
      finePrint: undefined,
    },
    {
      icon: 'chart',
      title: 'Paid ads for short-term rentals',
      price: '$500',
      intro: 'Google and Meta ads that send guests to your own site, measured against real bookings.',
      items: [
        'Google Ads and Meta Ads management, up to $3,500/month in ad spend',
        'Ad account setup and pixel tracking',
        'Automated weekly reports',
        'A monthly review meeting',
      ],
      finePrint: 'Ad spend is separate and paid directly to Google and Meta.',
    },
  ],
  seeAll: 'See everything included',
  terms: 'Month to month. Cancel anytime.',
  closing:
    "None of this is required to get your free design or your site. Most hosts start with the site. When it's live and converting, we can talk about filling it.",
  proof: {
    label: 'Proof',
    url: 'northstarnaturesuites.com',
    name: 'North Star Nature Suites',
    caption: 'Luxury cabin suites, Tennessee. Direct booking site designed and built by Captive Demand.',
    image: '/northstarnaturesuites.png',
    imageAlt: 'North Star Nature Suites direct booking website',
    stats: [
      { value: '+289%', label: 'Direct bookings', accent: true },
      { value: '−60%', label: 'OTA dependency', accent: false },
    ],
  },
};

export const FIT = {
  eyebrow: 'Who this is for',
  h2: 'Built for hosts who already run a booking system.',
  goodTitle: 'A good fit',
  good: [
    "You're on Hostaway, Guesty Pro, OwnerRez, or another PMS with an open API",
    'You have 3 or more listings',
    "You have a PMS website you've outgrown, or none yet",
    'You want more bookings to come through your own site',
  ],
  notTitle: 'Not a fit for this one',
  notAirbnbLead: 'You manage bookings in Airbnb or Vrbo only.',
  notAirbnbLink: 'We have a different offer for that',
  notAirbnbHref: '/direct-booking',
  not: [
    "You're on Guesty Lite (it doesn't include API access)",
    "You want a full rebrand first. We can help with that, but it's a different project.",
  ],
};

export const APPLY = {
  eyebrow: 'Apply',
  h2: 'Apply for your free design',
  intro: "We take these on a few at a time. Tell us about your setup, and we'll email you within 2 business days either way.",
  next: ['You apply, about a minute', 'We email you within 2 business days', "If it's a fit, a 15-minute call"],
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  emailHint: "We'll email you within 2 business days.",
  phone: 'Phone',
  phoneHint: "Optional. Only if you'd rather we text.",
  pms: 'Which booking system do you use?',
  pmsOther: 'Which one?',
  listings: 'How many listings?',
  currentSite: 'Your current website',
  currentSiteHint: "Leave blank if you don't have one yet.",
  listingUrl: 'A listing link',
  listingUrlHint: 'Airbnb, Vrbo or your site. We look at your photos before we decide.',
  problems: "What's wrong with your site today?",
  problemsNote: '(optional, pick any)',
  directShare: 'Roughly how many bookings come direct today?',
  traffic: 'Interested in help getting traffic too?',
  optional: '(optional)',
  submit: 'Send my application',
  submitting: 'Sending…',
  underSubmit: "We'll email you within 2 business days, whether it's a fit or not.",
  phoneError: 'That phone number looks incomplete. Leave it blank if you prefer email.',
  confirm: {
    title: (firstName: string) => `Got it, ${firstName}.`,
    body: (email: string) =>
      `We'll look at your listings and your current site and email you at ${email} within 2 business days. If it's a fit, the email will include a link to pick a time for a short call. Watch for an email from jordan@captivedemand.com.`,
    noPmsLead: 'This offer is built for hosts already on a booking system. You might like our other one:',
    noPmsLink: 'see the Airbnb and Vrbo offer',
    noPmsHref: '/direct-booking',
  },
};

export const FAQ = {
  eyebrow: 'Questions',
  h2: 'Questions',
  items: [
    {
      question: 'Do I have to leave my PMS?',
      answer:
        "No. That's the point. Your site connects to the PMS you already use, so your calendar, rates, payments and channel sync stay exactly where they are.",
    },
    {
      question: 'Which booking systems do you work with?',
      answer:
        "Hostaway, Guesty Pro and OwnerRez most often. We also work with Hospitable, Lodgify, Hostfully, Uplisting, Smoobu and Hostify. If your PMS has an open API, we can usually connect to it. We'll confirm on the call.",
    },
    {
      question: 'Is the design really free?',
      answer:
        "Yes. You get a custom design for your homepage, property pages and booking flow, delivered as files any developer can build from. It's yours whether you work with us or not.",
    },
    {
      question: 'What does the $100/month cover?',
      answer:
        "Fast, secure hosting on Vercel's global network with 24/7 uptime monitoring, a site built to load quickly and rank well in search, support when you need it, and Captive Studio, our CMS, so you can edit and update your site any time. New pages or a redesign later are quoted separately, per request.",
    },
    {
      question: 'Do you take a percentage of my bookings?',
      answer: "Never. It's a flat $100/month. Your PMS's own payment processing fees still apply, the same as today.",
    },
    {
      question: 'Will my guests book on my site, or get sent somewhere else?',
      answer:
        "On your site, with your domain, wherever your PMS allows it. Some booking systems complete payment on their own secure checkout; we'll tell you exactly how yours works on the call.",
    },
    {
      question: 'Do I need a new brand?',
      answer:
        "No. We design around your existing name, logo and photos. If you want a rebrand, we can talk about it, but you don't need one to get a better site.",
    },
    {
      question: 'I already have a direct booking site and it barely gets bookings. Will a new one fix that?',
      answer:
        "A better site converts more of the traffic you send it. Getting traffic is a separate job, and it's the one we do for a living: SEO and paid ads, $500/month each, whenever you want them. On the call we'll tell you honestly which problem you have.",
    },
    {
      question: 'Do I have to buy SEO or ads to get the site?',
      answer:
        'No. The design is free, the build is free, and the site is $100/month to host. SEO and ads are separate, optional, and month to month. Ad spend is paid directly to Google and Meta.',
    },
    {
      question: 'What does it take to qualify?',
      answer:
        "An API-capable PMS, 3 or more listings, and a property we can photograph well from what's already online. We review every application and email you either way.",
    },
    {
      question: 'What if I want to switch PMS later?',
      answer:
        "Your site and domain are yours. Because it's connected through the API, moving to another supported PMS means reconnecting the site, not rebuilding it.",
    },
    {
      question: 'How long does it take?',
      answer:
        'The design is usually ready about a week after the call. Once you approve it, build and launch takes 1 to 2 weeks.',
    },
  ],
};

export const FOOTER = {
  location: 'Nashville, TN',
  privacyLabel: 'Privacy',
  privacyHref: '/privacy',
  copyright: '© 2026 Captive Demand',
  logo: '/captive-demand-logo.png',
  logoAlt: 'Captive Demand',
};
