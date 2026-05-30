/**
 * Minimal advertising consent helper backed by localStorage. A real production
 * deployment should plug in a CMP (Cookiebot, OneTrust, etc.) and replace the
 * read/write below — the rest of the app only depends on hasAdvertisingConsent().
 */

const CONSENT_KEY = 'adConsent';
const CONSENT_EVENT = 'adConsentChanged';

export const hasAdvertisingConsent = () => {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(CONSENT_KEY) === 'granted';
  } catch {
    return false;
  }
};

export const setAdvertisingConsent = (granted) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied');
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { granted } }));
  } catch {
    /* storage may be unavailable (private mode, blocked) — ignore */
  }
};

/** Subscribe to consent changes; returns an unsubscribe fn. */
export const onConsentChange = (handler) => {
  if (typeof window === 'undefined') return () => {};
  const listener = (event) => handler(event.detail.granted);
  window.addEventListener(CONSENT_EVENT, listener);
  return () => window.removeEventListener(CONSENT_EVENT, listener);
};
