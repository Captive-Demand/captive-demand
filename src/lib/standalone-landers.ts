import { MEDSPAS_PATH } from '@/components/landers/medspas/data';
import { SHORE_PARTNERSHIP_PATH } from '@/lib/shore-partnership';

/** Public URL for the direct booking ad landing page */
export const DIRECT_BOOKING_PATH = '/direct-booking';

/** Public URL for the direct booking ad landing page aimed at hosts already on a PMS */
export const DIRECT_BOOKING_PMS_PATH = '/direct-booking-pms';

/**
 * Routes that render their own chrome. The site navbar, footer, and the global
 * request modals are suppressed on these paths.
 */
export const STANDALONE_LANDER_PATHS = [
  SHORE_PARTNERSHIP_PATH,
  DIRECT_BOOKING_PATH,
  DIRECT_BOOKING_PMS_PATH,
  MEDSPAS_PATH,
] as const;

function normalizePath(pathname: string | null | undefined): string | null {
  if (!pathname) return null;
  return pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
}

export function isStandaloneLanderPath(pathname: string | null | undefined): boolean {
  const normalized = normalizePath(pathname);
  if (!normalized) return false;
  return (STANDALONE_LANDER_PATHS as readonly string[]).includes(normalized);
}

/** Either direct booking ad lander. Neither loads reCAPTCHA or the site's request modals. */
export function isDirectBookingPath(pathname: string | null | undefined): boolean {
  const normalized = normalizePath(pathname);
  return normalized === DIRECT_BOOKING_PATH || normalized === DIRECT_BOOKING_PMS_PATH;
}
