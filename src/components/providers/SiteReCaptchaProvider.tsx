'use client';

import { usePathname } from 'next/navigation';
import { GoogleReCaptchaContext, GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import { recaptchaSiteKey } from '@/lib/recaptcha-config';
import { isDirectBookingPath } from '@/lib/standalone-landers';

const EMPTY_RECAPTCHA_CTX = { executeRecaptcha: undefined };

export function SiteReCaptchaProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const key = recaptchaSiteKey();

  // The direct booking lander has no reCAPTCHA-verified form, so skip the script there.
  // Other standalone landers (Shore) still need it — their forms post to /api/contact.
  if (!key || isDirectBookingPath(pathname)) {
    return <GoogleReCaptchaContext.Provider value={EMPTY_RECAPTCHA_CTX}>{children}</GoogleReCaptchaContext.Provider>;
  }

  return <GoogleReCaptchaProvider reCaptchaKey={key}>{children}</GoogleReCaptchaProvider>;
}
