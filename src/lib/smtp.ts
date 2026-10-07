import nodemailer from 'nodemailer';

/** The site's outbound mail account (`SMTP_*`). Null when it isn't configured. */
export function getSmtpTransport(): nodemailer.Transporter | null {
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

export function smtpFromAddress(): string | undefined {
  return process.env.SMTP_FROM ?? process.env.SMTP_USER;
}
