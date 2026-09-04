import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

import { parseAnnualCompanyRevenue, revenueLabel } from '@/lib/annual-company-revenue';
import { submitHubSpotAuditForm } from '@/lib/hubspot-form';
import { isRecaptchaVerificationEnabled } from '@/lib/recaptcha-config';

type Body = {
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  /** `AnnualCompanyRevenue` when from our forms */
  annualCompanyRevenue?: string;
  service?: string;
  budget?: string;
  message?: string;
  /** Shore partnership: how many sites need help */
  siteCount?: string;
  recaptchaToken?: string;
  source?: string;
  formLocation?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  pageUri?: string;
  pageName?: string;
  hutk?: string;
};

const SHORE_FORM_SOURCES = new Set([
  'main-form',
  'audit-form',
  'exit-intent',
  'shore_partnership',
  'shore_partnership_audit',
]);

/** Shore partnership landing — skips revenue gate; routes like Spencer brief */
function isShorePartnershipSource(source: string | undefined): boolean {
  return SHORE_FORM_SOURCES.has(source?.trim() ?? '');
}

function isShoreAuditSource(source: string | undefined): boolean {
  const s = source?.trim() ?? '';
  return s === 'audit-form' || s === 'exit-intent' || s === 'shore_partnership_audit';
}

/** CC for non-Shore lead emails (override with LEAD_CC_EMAIL). */
const DEFAULT_LEAD_CC = 'zachary@captivedemand.com';

/** Shore partnership forms (contact, audit, exit intent) notify this list. */
const DEFAULT_SHORE_LEAD_RECIPIENTS = [
  'spencer@captivedemand.com',
  'jordan@captivedemand.com',
  'zachary@captivedemand.com',
] as const;

function leadCcEmail(): string {
  return process.env.LEAD_CC_EMAIL?.trim() || DEFAULT_LEAD_CC;
}

function shoreLeadRecipients(): string[] {
  const override = process.env.SHORE_LEAD_EMAILS?.trim();
  if (override) {
    return override
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);
  }
  return [...DEFAULT_SHORE_LEAD_RECIPIENTS];
}

function getTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, '');
  if (!host || !user || !pass) return null;
  const port = Number(process.env.SMTP_PORT ?? '465');
  const secureFlag = process.env.SMTP_SECURE;
  const secure =
    secureFlag === 'true' ? true : secureFlag === 'false' ? false : port === 465;
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

function formatLeadBody(params: {
  name: string;
  businessName: string;
  annualRevenueLabel: string;
  replyEmail: string;
  extra?: string;
}): string {
  const lines = [
    `Name: ${params.name}`,
    `Business Name: ${params.businessName}`,
    `Annual Company Revenue: ${params.annualRevenueLabel}`,
    `Reply-to email: ${params.replyEmail}`,
  ];
  if (params.extra?.trim()) {
    lines.push('', params.extra.trim());
  }
  return lines.join('\n');
}

async function sendLeadToCeo(
  transporter: nodemailer.Transporter,
  params: { subject: string; text: string; isShore?: boolean },
): Promise<void> {
  const fromAddr = process.env.SMTP_FROM ?? process.env.SMTP_USER;

  if (params.isShore) {
    const recipients = shoreLeadRecipients();
    if (recipients.length === 0) {
      console.warn('No Shore lead recipients configured; email not sent.');
      return;
    }
    await transporter.sendMail({
      from: fromAddr,
      to: recipients.join(', '),
      subject: params.subject,
      text: params.text,
    });
    return;
  }

  const ceo = process.env.CEO_EMAIL?.trim();
  const cc = leadCcEmail();

  if (!ceo) {
    console.warn('CEO_EMAIL is not set; sending lead only to CC address.');
    await transporter.sendMail({
      from: fromAddr,
      to: cc,
      subject: `${params.subject} [CEO_EMAIL not configured]`,
      text: params.text,
    });
    return;
  }

  await transporter.sendMail({
    from: fromAddr,
    to: ceo,
    cc,
    subject: params.subject,
    text: params.text,
  });
}

async function verifyRecaptcha(token: string): Promise<{ ok: boolean }> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { ok: true };

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  });
  const data = (await res.json()) as { success?: boolean; score?: number };
  if (!data.success) return { ok: false };
  if (typeof data.score === 'number' && data.score < 0.5) return { ok: false };
  return { ok: true };
}

async function rejectIfRecaptchaInvalid(token: string | undefined) {
  if (!isRecaptchaVerificationEnabled()) return null;

  const trimmed = token?.trim() ?? '';
  if (!trimmed) {
    return NextResponse.json({ error: 'reCAPTCHA required' }, { status: 400 });
  }

  const verification = await verifyRecaptcha(trimmed);
  if (!verification.ok) {
    return NextResponse.json({ error: 'reCAPTCHA failed' }, { status: 400 });
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const email = body.email?.trim();
    const displayName = (body.name ?? body.fullName)?.trim();
    const businessName = body.businessName?.trim();
    const revenueParsed = parseAnnualCompanyRevenue(body.annualCompanyRevenue);
    const isPricingModal = body.source === 'pricing_modal';
    const isShorePartnership = isShorePartnershipSource(body.source);
    const isShoreAudit = isShoreAuditSource(body.source);
    const shoreFormSource = body.source?.trim() ?? 'main-form';

    const phone = body.phone?.trim();

    if (!displayName || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    if (!businessName) {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 });
    }

    if (isShoreAudit && !phone) {
      return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
    }

    if (!isShorePartnership && !revenueParsed) {
      return NextResponse.json({ error: 'Annual company revenue is required' }, { status: 400 });
    }

    const annualRevenueLabel = revenueParsed ? revenueLabel(revenueParsed) : 'Not collected (Shore partnership page)';

    const recaptchaFailure = await rejectIfRecaptchaInvalid(body.recaptchaToken);
    if (recaptchaFailure) return recaptchaFailure;

    if (isShoreAudit && phone) {
      const hubspot = await submitHubSpotAuditForm({
        fullName: displayName,
        email,
        phone,
        company: businessName,
        siteUrls: body.message?.split('\n') ?? [],
        formLocation: body.formLocation?.trim() || shoreFormSource,
        utmSource: body.utmSource,
        utmMedium: body.utmMedium,
        utmCampaign: body.utmCampaign,
        pageUri: body.pageUri,
        pageName: body.pageName,
        hutk: body.hutk,
      });
      if (!hubspot.ok) {
        console.error('Shore audit HubSpot submit failed:', hubspot.error);
      }
    }

    const transporter = getTransport();

    if (transporter) {
      if (isShorePartnership) {
        const siteCountLine = body.siteCount?.trim() ? `Sites in scope: ${body.siteCount.trim()}` : '';
        const text = [
          `Form source: ${shoreFormSource}`,
          `Name: ${displayName}`,
          `Portfolio company: ${businessName}`,
          phone ? `Phone: ${phone}` : '',
          siteCountLine,
          `Reply-to email: ${email}`,
          body.message?.trim()
            ? isShoreAudit
              ? `\nSite URLs:\n${body.message.trim()}`
              : `\nMessage:\n${body.message.trim()}`
            : '',
        ]
          .filter(Boolean)
          .join('\n');
        try {
          await sendLeadToCeo(transporter, {
            subject: `New Shore lead via ${shoreFormSource}: ${displayName} · ${businessName}`,
            text,
            isShore: true,
          });
        } catch (mailErr) {
          console.error('Shore partnership lead: email send failed:', mailErr);
          return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
        }
      } else if (isPricingModal) {
        const text = formatLeadBody({
          name: displayName,
          businessName,
          annualRevenueLabel,
          replyEmail: email,
        });
        try {
          await sendLeadToCeo(transporter, {
            subject: 'New lead — Pricing (Captive Demand)',
            text,
          });
        } catch (mailErr) {
          console.error('Pricing lead: email send failed (user still allowed to continue):', mailErr);
        }
      } else {
        const extraLines = [
          body.service ? `Service: ${body.service}` : '',
          body.budget ? `Budget: ${body.budget}` : '',
          body.message ? `Message:\n${body.message}` : '',
        ]
          .filter(Boolean)
          .join('\n\n');

        const text = formatLeadBody({
          name: displayName,
          businessName,
          annualRevenueLabel,
          replyEmail: email,
          extra: extraLines || undefined,
        });

        try {
          await sendLeadToCeo(transporter, {
            subject: `New lead — Contact form: ${displayName}`,
            text,
          });
        } catch (mailErr) {
          console.error('Contact form: email send failed:', mailErr);
          return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
        }
      }
    } else if (isPricingModal) {
      console.warn('Pricing lead accepted; configure SMTP + CEO_EMAIL to send mail.', {
        displayName,
        email,
        businessName,
        annualCompanyRevenue: annualRevenueLabel,
      });
    } else if (isShorePartnership) {
      console.log('Shore partnership lead (no SMTP):', {
        displayName,
        email,
        businessName,
        message: body.message?.slice(0, 500),
      });
    } else {
      console.log('Contact form (no SMTP):', {
        displayName,
        email,
        businessName,
        annualCompanyRevenue: annualRevenueLabel,
      });
    }

    return NextResponse.json({
      success: true,
      ...(isPricingModal
        ? {
            qualifiesForBooking:
              revenueParsed !== null &&
              (revenueParsed === '500k_1m' || revenueParsed === '1m_plus'),
          }
        : {}),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
