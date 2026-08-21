import { createElement } from 'react';
import Link from 'next/link';
import type { ServiceFaqItem } from '@/types/service-faq';

const FAQ_LINK =
  'underline decoration-white/30 underline-offset-2 transition-colors duration-150 hover:text-white';

export const emailNationalFaqs: ServiceFaqItem[] = [
  {
    question: 'How much does an email marketing agency cost?',
    answer:
      "Ours starts at $2,500/month, priced project to project and scaling with how many new emails, sequences, and templates you're building in a given month. We don't price by list size. The number of contacts you have doesn't reflect the work involved.",
    tags: ['Pricing', 'Email'],
  },
  {
    question: 'Do we need to switch email platforms?',
    answer:
      'No. Captive Mail connects to whichever platform you already use, including HubSpot, ActiveCampaign, and Mailchimp. No migration, no rebuild.',
    tags: ['Platform', 'ESP'],
  },
  {
    question: 'Who writes the copy?',
    answer: 'We do. Our team writes it, you approve it, and only approved copy ships.',
    tags: ['Copy', 'Process'],
  },
  {
    question: 'How do approvals work?',
    answer:
      "Through the tools you already use. Campaign requests come through your Asana or Monday board, feedback happens in a dedicated Slack channel, and Captive Mail applies those edits to the build automatically. Your team doesn't learn a new system.",
    tags: ['Workflow', 'Slack'],
  },
  {
    question: 'Can you use data from our product or internal systems?',
    answer:
      "Yes, that's what Conduit does. It pulls from sources like Metabase, Mixpanel, and Google Sheets and pushes into your marketing platform on a schedule you set, so campaigns can be triggered by what someone actually did rather than which list they're on. And because we built Conduit ourselves, we're not limited to the standard connectors. If your data lives in an internal database or a booking system, we build that integration for you.",
    tags: ['Conduit', 'Data'],
  },
  {
    question: 'Do you handle deliverability?',
    answer:
      "Yes: SPF and DKIM setup, domain reputation monitoring, and list hygiene. It's the first thing we audit, because a deliverability problem makes everything else pointless.",
    tags: ['Deliverability'],
  },
  {
    question: 'Do you do one-off sends or only automated sequences?',
    answer: 'Both. Evergreen automated campaigns and one-off broadcasts, promotions, and newsletters.',
    tags: ['Campaigns'],
  },
  {
    question: 'Can you work with our in-house team?',
    answer:
      'Yes. Most of our clients have someone internal owning marketing. We plug into their workflow, collaborate on approvals and campaign planning, and take the production load off them.',
    tags: ['Team'],
  },
];

export const emailNashvilleFaqs: ServiceFaqItem[] = [
  {
    question: 'How much does a Nashville email marketing agency cost?',
    answer:
      "Ours starts at $2,500/month, priced project to project and scaling with how many new emails, sequences, and templates you're building. We don't price by list size.",
    tags: ['Pricing', 'Nashville'],
  },
  {
    question: 'Do we need to switch email platforms?',
    answer:
      'No. We connect to whichever platform you already use, including HubSpot, ActiveCampaign, and Mailchimp.',
    tags: ['Platform'],
  },
  {
    question: 'Who writes the copy?',
    answer: 'We do. Our team writes it, you approve it, and only approved copy ships.',
    tags: ['Copy'],
  },
  {
    question: 'How do approvals work?',
    answer:
      "Through the tools you already use: campaign requests through your Asana or Monday board, feedback in a dedicated Slack channel, and the edits get applied to the build automatically. Your team doesn't learn a new system.",
    tags: ['Workflow'],
  },
  {
    question: 'Do we need to be in Nashville to work with you?',
    answer:
      "No, and most of our clients aren't. Email is the least location-dependent service we offer. Being local mainly means in-person kickoffs and planning, and knowing your market's seasonality.",
    tags: ['Local'],
  },
  {
    question: 'Can you use data from our booking system or internal database?',
    answer:
      "Yes. Conduit is our own software and pulls from wherever your data lives into your marketing platform, so campaigns trigger on what someone actually did. If your system isn't a standard connector, we build the integration.",
    tags: ['Conduit'],
  },
  {
    question: 'Can you work with our in-house marketer?',
    answer:
      'Yes, and most of our clients have one. We plug into their workflow and take the production load off them.',
    tags: ['Team'],
  },
  {
    question: 'Do you also do SEO and paid ads?',
    answer:
      createElement(
        'span',
        null,
        'Yes, both are separate services. See ',
        createElement(
          Link,
          { href: '/nashville-seo-agency', className: FAQ_LINK },
          'SEO and answer engine optimization in Nashville',
        ),
        ' and ',
        createElement(
          Link,
          { href: '/nashville-advertising-agency', className: FAQ_LINK },
          'paid advertising in Nashville',
        ),
        '.',
      ),
    tags: ['Services'],
  },
];

export const seoNationalFaqs: ServiceFaqItem[] = [
  {
    question: 'What is answer engine optimization?',
    answer:
      "Answer engine optimization, or AEO, is the practice of structuring your content so AI-generated answers cite it. Where traditional SEO works to rank a page in a list of results, AEO works to get your content selected as a source when an engine like Google's AI Overviews, ChatGPT, or Perplexity generates a direct answer. In practice it relies on schema markup, clear content structure, and pages that answer a specific question completely.",
    tags: ['AEO', 'Explainer'],
  },
  {
    question: "What's the difference between AEO and GEO?",
    answer:
      "They overlap heavily. Answer engine optimization is the broader term for getting cited in AI-generated answers, including Google's AI Overviews. Generative engine optimization usually refers to the same goal aimed specifically at generative tools like ChatGPT, Perplexity, and Gemini. The underlying work is largely the same, and we treat them as one program.",
    tags: ['AEO', 'GEO'],
  },
  {
    question: 'Is SEO still worth doing if AI is answering questions?',
    answer:
      'Yes, and more than before. Answer engines build their responses from indexed content, so pages that rank well are disproportionately likely to be the ones cited. Ranking is now both an end in itself and a prerequisite for being quoted.',
    tags: ['SEO', 'AEO'],
  },
  {
    question: 'How much do answer engine optimization services cost?',
    answer:
      'Ours start at $500/month for up to three priority pages, scaling with the number of pages and whether offsite work is included. We price site by site beyond that, since scope varies enormously.',
    tags: ['Pricing'],
  },
  {
    question: 'How long does SEO take to show results?',
    answer:
      "Depends on the domain's existing authority, the competitiveness of the terms, and the state of the site technically. What we'll commit to is telling you honestly at the audit stage which targets are realistic in what timeframe, rather than selling you a keyword you can't win.",
    tags: ['Timeline'],
  },
  {
    question: 'Do you do the work or just tell us what to do?',
    answer:
      "We do it. Prominence integrates with your CMS and ships changes directly: technical updates, content, new pages, and schema markup, averaging 200+ optimizations per site per month. You're not receiving a list of recommendations to implement yourself.",
    tags: ['Prominence'],
  },
  {
    question: 'Do you build links?',
    answer:
      "Yes, white-hat only. Earned placements and content distributed across relevant domains. No private blog networks or purchased links. The short-term gain isn't worth the risk to your domain.",
    tags: ['Offsite'],
  },
  {
    question: 'Can you work with our existing team?',
    answer:
      "Yes. We often run alongside in-house marketers or a content team. We just need clarity on who owns what so we're not duplicating or contradicting each other.",
    tags: ['Team'],
  },
];

export const seoNashvilleFaqs: ServiceFaqItem[] = [
  {
    question: 'How much does a Nashville SEO agency cost?',
    answer:
      "Ours starts at $500/month for up to three priority pages, scaling with the number of pages and whether offsite work is included. We price site by site beyond that.",
    tags: ['Pricing', 'Nashville'],
  },
  {
    question: 'How long before we see results?',
    answer:
      "It depends on your domain's authority, how competitive your terms are, and the technical state of the site. What we'll commit to is telling you honestly at the audit which targets are realistic and in what timeframe, rather than selling you a keyword you can't win.",
    tags: ['Timeline'],
  },
  {
    question: 'Do you do local SEO and Google Business Profile?',
    answer:
      'Yes: map pack rankings, profile optimization, local citations, and review signals. For most Nashville businesses serving a local area, that work is worth more than the organic results underneath it.',
    tags: ['Local SEO', 'GBP'],
  },
  {
    question: 'What is answer engine optimization, and does it matter for a local business?',
    answer:
      'It\'s the practice of structuring your content so AI-generated answers cite it. It matters more for local businesses than most, because "best [service] in Nashville" is exactly the kind of question people now ask an assistant instead of a search engine, and if you\'re not in that answer, there\'s no results page to be further down.',
    tags: ['AEO'],
  },
  {
    question: 'Do we need to be in Nashville to work with you?',
    answer:
      "No, and most of our clients aren't. Being local mainly changes the in-person parts and the market knowledge: which neighborhoods convert, which local links are worth pursuing, how seasonality moves your numbers.",
    tags: ['Local'],
  },
  {
    question: 'Do you do the work or just advise?',
    answer:
      "We do it. Prominence connects to your CMS and ships changes directly, averaging 200+ optimizations per site per month. You're not getting a list of recommendations to implement yourself.",
    tags: ['Prominence'],
  },
  {
    question: 'Do you also run paid ads?',
    answer:
      createElement(
        'span',
        null,
        'Yes. Paid advertising is a separate service. See ',
        createElement(
          Link,
          { href: '/nashville-advertising-agency', className: FAQ_LINK },
          'paid advertising in Nashville',
        ),
        '.',
      ),
    tags: ['Services'],
  },
];

export const adsNationalFaqs: ServiceFaqItem[] = [
  {
    question: 'How much does a PPC agency cost?',
    answer:
      'Ours starts at $2,500/month for a single channel and $3,500/month for two or more. Above that we charge 10% of ad spend, capped at $5,000/month total. Most agencies charge an uncapped percentage, which means their fee keeps climbing as you scale.',
    tags: ['Pricing', 'PPC'],
  },
  {
    question: "What's the minimum ad spend you work with?",
    answer:
      '$5,000/month in ad spend, and we work with companies generating at least $1M in annual revenue. Below that threshold, agency management typically costs more than it returns.',
    tags: ['Qualification'],
  },
  {
    question: 'Do you make the ad creative or do we?',
    answer:
      'We do. Static ad creative is included at every tier, produced in the aspect ratios each placement needs. Most agencies leave creative to the client, which is usually where campaigns stall.',
    tags: ['Creative'],
  },
  {
    question: 'Which platforms do you manage?',
    answer:
      "Google Ads and Meta (Facebook and Instagram) are the core. We also run TikTok, Bing, Pinterest, and LinkedIn where the audience is genuinely there. One strategist covers every channel so your accounts aren't competing with each other.",
    tags: ['Channels'],
  },
  {
    question: 'How fast can campaigns launch?',
    answer:
      "Hours, not weeks, once strategy and creative are approved. We build through our own software, AdFactory, which posts directly to the ad platform APIs. Everything builds paused for your review before anything spends.",
    tags: ['AdFactory', 'Speed'],
  },
  {
    question: 'Do you handle conversion tracking?',
    answer:
      "Yes, including server-side implementation and CRM conversion import. We verify tracking is live and accurate before launching — automated bidding optimizes toward whatever signal you feed it, so a broken signal wastes the entire budget.",
    tags: ['Tracking'],
  },
  {
    question: 'Can you work with our existing agency or in-house team?',
    answer:
      "Yes. We regularly run alongside an in-house marketer or another agency handling a different channel. The one thing we ask for is clarity on who owns which channel and which conversion actions, so we're not optimizing against each other with the same budget.",
    tags: ['Team'],
  },
  {
    question: 'Who will I actually be working with?',
    answer:
      "The senior strategist who builds your strategy. They run your recurring calls — as often as weekly, set to match the pace of your account — and you can reach them directly between meetings. You won't be handed off to a coordinator after signing.",
    tags: ['Team'],
  },
];

export const adsNashvilleFaqs: ServiceFaqItem[] = [
  {
    question: 'How much does a Nashville advertising agency cost?',
    answer:
      "Ours starts at $2,500/month for a single channel and $3,500/month for two or more, plus 10% of ad spend capped at $5,000/month total. Traditional Nashville creative agencies typically price per project or on an uncapped retainer, so a direct comparison depends on what you're buying.",
    tags: ['Pricing', 'Nashville'],
  },
  {
    question: 'Do you do brand campaigns or creative concepting?',
    answer:
      "No. We run paid advertising on Google and Meta and produce the static ad creative that goes in it. If you need a brand platform or a broadcast campaign, Nashville has excellent shops for that and we'll point you toward one.",
    tags: ['Positioning'],
  },
  {
    question: 'Do we need to be in Nashville to work with you?',
    answer:
      "No. Most of our clients aren't. Being local mainly changes the in-person parts: kickoffs, planning sessions, and knowing the market when campaigns are geo-targeted around Middle Tennessee.",
    tags: ['Local'],
  },
  {
    question: "What's the minimum ad spend?",
    answer:
      '$5,000/month in ad spend, with companies generating at least $1M in annual revenue. Below that, agency management usually costs more than it returns.',
    tags: ['Qualification'],
  },
  {
    question: 'Do you make the ad creative?',
    answer:
      'Yes, included at every tier, built in the aspect ratios each placement needs. Most agencies hand creative back to the client, which is where campaigns usually stall.',
    tags: ['Creative'],
  },
  {
    question: 'Can you work with our existing agency or in-house team?',
    answer:
      "Yes. We often run alongside an in-house marketer or another agency on a different channel. We just need clarity on who owns which channel and which conversion actions, so we're not optimizing against each other with the same budget.",
    tags: ['Team'],
  },
  {
    question: 'Do you also do SEO?',
    answer:
      createElement(
        'span',
        null,
        'Yes. Organic search and answer engine optimization are a separate service. See ',
        createElement(
          Link,
          { href: '/nashville-seo-agency', className: FAQ_LINK },
          'organic search and answer engine optimization',
        ),
        '.',
      ),
    tags: ['Services'],
  },
];
