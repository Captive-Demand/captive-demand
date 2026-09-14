/**
 * Ad attribution captured on landing and replayed after a booking.
 *
 * HubSpot Meetings collects only name and email, so the UTM/click IDs that tell
 * us which creative produced a call have to be carried by us and stamped onto
 * the contact afterwards.
 */

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  landing_url?: string;
  landed_at?: string;
}

const STORAGE_KEY = 'cd_attribution';

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;

function readStored(): Attribution {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as Attribution;
  } catch {
    return {};
  }
}

function write(value: Attribution): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* private mode / quota — attribution is best effort */
  }
}

/**
 * Call once on mount. Merges this URL's params over anything stored this
 * session, so a fresh ad click overwrites but an internal navigation does not
 * wipe what we already have. Never throws.
 */
export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return {};

  const stored = readStored();

  try {
    const params = new URLSearchParams(window.location.search);
    const incoming: Attribution = {};

    for (const key of UTM_KEYS) {
      const value = params.get(key)?.trim();
      if (value) incoming[key] = value;
    }

    const fbclid = params.get('fbclid')?.trim();
    if (fbclid) incoming.fbclid = fbclid;

    if (Object.keys(incoming).length === 0) {
      if (!stored.landing_url) {
        const seeded = {
          ...stored,
          landing_url: window.location.href,
          landed_at: new Date().toISOString(),
        };
        write(seeded);
        return seeded;
      }
      return stored;
    }

    const merged: Attribution = {
      ...stored,
      ...incoming,
      landing_url: window.location.href,
      landed_at: new Date().toISOString(),
    };
    write(merged);
    return merged;
  } catch {
    return stored;
  }
}

export function getAttribution(): Attribution {
  return readStored();
}

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  if (!match) return undefined;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

/**
 * Meta's click ID cookie. Prefers the real `_fbc` the pixel sets; otherwise
 * derives the documented `fb.1.<timestamp>.<fbclid>` form so a server-side
 * Conversions API event can still match the click later.
 */
export function getFbc(fbclid?: string): string | undefined {
  const cookie = readCookie('_fbc');
  if (cookie) return cookie;
  const id = fbclid ?? getAttribution().fbclid;
  if (!id) return undefined;
  return `fb.1.${Date.now()}.${id}`;
}

/** Meta's browser ID cookie, set by the pixel. */
export function getFbp(): string | undefined {
  return readCookie('_fbp');
}
