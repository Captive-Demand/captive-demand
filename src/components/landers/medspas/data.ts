export const MEDSPAS_PATH = '/medspas';

/** Where every "book a call" CTA on the page lands. */
export const MEDSPAS_BOOK_HREF = '/contact';

/** Free booking-flow scanner. */
export const BOOKING_AUDIT_URL = 'https://preview.captivedemand.com/free-booking-audit/';

export type MedSpaService = {
  id: string;
  num: string;
  name: string;
  short: string;
  blurb: string;
  /** Starting monthly price in USD. */
  price: number;
  priceNote?: string;
};

export const MEDSPA_SERVICES: MedSpaService[] = [
  {
    id: 'svc-booking',
    num: '01',
    name: 'Custom booking flows',
    short: 'Booking',
    blurb: 'Fewer steps to book on Boulevard, Zenoti, Mindbody and more.',
    price: 99,
  },
  {
    id: 'svc-web',
    num: '02',
    name: 'Custom websites',
    short: 'Websites',
    blurb: 'Fast, SEO-ready sites you can edit with Captive Studio.',
    price: 150,
  },
  {
    id: 'svc-chat',
    num: '03',
    name: 'AI chat agents',
    short: 'Chat agents',
    blurb: 'Answers questions and books from live availability, 24/7.',
    price: 99,
  },
  {
    id: 'svc-seo',
    num: '04',
    name: 'Local SEO',
    short: 'SEO',
    blurb: 'Rank service pages and climb the Google Map Pack.',
    price: 500,
  },
  {
    id: 'svc-ppc',
    num: '05',
    name: 'Google & Meta ads',
    short: 'Paid ads',
    blurb: 'Creative, management and Northstar reporting.',
    price: 500,
    priceNote: 'plus ad spend',
  },
  {
    id: 'svc-life',
    num: '06',
    name: 'Lifecycle marketing',
    short: 'Lifecycle',
    blurb: 'Designed emails and journeys that drive repeat visits.',
    price: 750,
  },
];

export type ClientLogo = {
  name: string;
  href: string;
  /** Image logo; omitted for clients that render as a text wordmark. */
  src?: string;
  width?: number;
  height?: number;
  /** Rendered height in px. */
  displayHeight?: number;
  wordmarkClassName?: string;
};

export const MEDSPA_CLIENT_LOGOS: ClientLogo[] = [
  { name: 'Arete Wellness', href: 'https://www.arete-wellness.com/', src: '/medspas/arete-logo-dark.png', width: 1701, height: 517, displayHeight: 28 },
  { name: 'Mantality Health', href: 'https://mantalityhealth.com/', src: '/medspas/mantality-logo-dark.png', width: 640, height: 125, displayHeight: 28 },
  { name: 'HitX', href: 'https://hitx.com', src: '/medspas/hitx-logo-dark.png', width: 2702, height: 1038, displayHeight: 28 },
  { name: 'Agentis Longevity', href: 'https://agentis.com', src: '/agentis-logo.svg', width: 504, height: 207, displayHeight: 34 },
  { name: 'SLK Clinic', href: 'https://slkclinic.com/', wordmarkClassName: 'font-semibold tracking-[0.04em] uppercase' },
  { name: 'Empower Aesthetics', href: 'https://www.empower.spa/', src: '/empower-aesthetics-logo-trimmed.png', width: 1169, height: 706, displayHeight: 34 },
  { name: 'Biodesign', href: 'https://biodesignclinic.com/', wordmarkClassName: 'font-normal lowercase tracking-[0.02em]' },
];

export type MedSpaTestimonial = {
  quote: string;
  author: string;
  role: string;
  image: string;
  imageClassName?: string;
};

export const MEDSPA_TESTIMONIALS: MedSpaTestimonial[] = [
  {
    quote:
      'We’ve had a great experience working with Captive Demand. As a company with several different brands, we needed a partner who could handle a variety of needs. What really sets them apart is that they’re true strategic thought partners. Their designs are always beautiful as well. Highly recommend!',
    author: 'Sophia Sparrgrove',
    role: 'Marketing Manager, Empower Aesthetics',
    image: '/sophia-sparrgrove.png',
  },
  {
    quote:
      'Amazing group, and amazing people. Can’t say enough good things about what they have done for us. Very responsive and genuine team players and problem solvers!',
    author: 'Lacie Randall',
    role: 'Director of Marketing, Agentis Longevity',
    image: '/lacie-randall.jpg',
  },
  {
    quote:
      'Captive has been easy to work with from day one. Whenever something comes up, they’re quick to respond, clear about what needs to happen, and they actually get it handled. It’s been nice having a team we can trust with that side of the business.',
    author: 'Van Hunt',
    role: 'Cofounder, Arete Wellness',
    image: '/arete-wellness-logo.png',
    imageClassName: 'object-contain bg-white p-1.5',
  },
  {
    quote:
      'Captive Demand helped us build a digital presence that truly represents our brand. The team was responsive and delivered exactly what we needed.',
    author: 'Kevin Doughty',
    role: 'Founder, HitX',
    image: '/medspas/hitx-logo-dark.png',
    imageClassName: 'object-contain bg-white p-2',
  },
];
