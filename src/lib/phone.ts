/**
 * Phone validation shared by every lead form and the API routes behind them.
 *
 * A lead we cannot call back is a lead we lost, so the rules are strict enough
 * to catch a missing or extra digit and loose enough to accept how people
 * actually type numbers: "(615) 555-0123", "615.555.0123", "+1 615 555 0123",
 * "+44 20 7946 0958".
 */

export interface PhoneValidation {
  ok: boolean;
  /** E.164, e.g. `+16155550123`. What we store and send to HubSpot. */
  e164?: string;
  /** How we show it back to the person, e.g. `(615) 555-0123`. */
  display?: string;
  /** Why it failed, written for the person typing it. */
  message?: string;
}

const SEPARATORS = /[\s().\-‐-―]/g;

function nanpDisplay(digits: string): string {
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function looksFake(digits: string): boolean {
  if (/^(\d)\1+$/.test(digits)) return true; // 0000000000, 5555555555
  if (digits === '1234567890' || digits === '0123456789') return true;
  return false;
}

export function validatePhone(input: string | null | undefined): PhoneValidation {
  const raw = (input ?? '').trim();
  if (!raw) return { ok: false, message: 'Enter a phone number so we can reach you.' };

  const stripped = raw.replace(SEPARATORS, '');
  if (!/^\+?\d+$/.test(stripped)) {
    return { ok: false, message: 'Use digits only, like (615) 555-0123.' };
  }

  // International: keep whatever they typed after the country code.
  if (stripped.startsWith('+') && !stripped.startsWith('+1')) {
    const digits = stripped.slice(1);
    if (digits.length < 8 || digits.length > 15) {
      return { ok: false, message: 'That international number should have 8 to 15 digits after the country code.' };
    }
    if (looksFake(digits)) return { ok: false, message: "That doesn't look like a real number." };
    return { ok: true, e164: `+${digits}`, display: raw };
  }

  let digits = stripped.replace(/^\+/, '');
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);

  if (digits.length !== 10) {
    const count = digits.length;
    return {
      ok: false,
      message:
        count < 10
          ? `That number has ${count} digit${count === 1 ? '' : 's'}. US and Canadian numbers need 10.`
          : `That number has ${count} digits. US and Canadian numbers need 10.`,
    };
  }

  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(digits)) {
    return { ok: false, message: "That doesn't look like a valid number. Check the area code." };
  }
  if (looksFake(digits)) return { ok: false, message: "That doesn't look like a real number." };

  return { ok: true, e164: `+1${digits}`, display: nanpDisplay(digits) };
}

/** True when the value would pass `validatePhone`. */
export function isValidPhone(input: string | null | undefined): boolean {
  return validatePhone(input).ok;
}
