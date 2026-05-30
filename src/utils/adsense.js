/**
 * Centralized Google AdSense loader.
 *
 * Responsibilities:
 *  - Read config from REACT_APP_* env vars (never hardcode the publisher ID).
 *  - Inject the AdSense script tag exactly once per page load.
 *  - Expose a small API for ad slots to register themselves.
 *  - Fail silently in production, log in development.
 */

const ADSENSE_SRC_PREFIX = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

let scriptLoadPromise = null;

const isDevelopment = () => process.env.NODE_ENV === 'development';

const log = (...args) => {
  if (isDevelopment()) console.log('[adsense]', ...args);
};

const warn = (...args) => {
  if (isDevelopment()) console.warn('[adsense]', ...args);
};

export const getAdSenseClient = () => process.env.REACT_APP_ADSENSE_CLIENT || '';

/**
 * Ads must be explicitly enabled AND configured AND not running in local dev
 * (Google's policy forbids serving live ads on localhost / test traffic).
 */
export const isAdsEnabled = () => {
  const enabled = String(process.env.REACT_APP_ADS_ENABLED).toLowerCase() === 'true';
  const client = getAdSenseClient();
  if (!enabled) return false;
  if (!client) {
    warn('Ads enabled but REACT_APP_ADSENSE_CLIENT is missing; skipping.');
    return false;
  }
  if (!/^ca-pub-\d+$/.test(client)) {
    warn(`Invalid AdSense client format: "${client}". Expected ca-pub-XXXXXXXXXXXXXXXX.`);
    return false;
  }
  if (isDevelopment()) {
    log('Skipping ad render: NODE_ENV=development.');
    return false;
  }
  return true;
};

/**
 * Inject the adsbygoogle script tag exactly once. Subsequent callers receive
 * the same promise so concurrent ad slots wait on a single network load.
 */
export const loadAdSenseScript = () => {
  if (typeof window === 'undefined') return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;

  const client = getAdSenseClient();
  if (!client) {
    scriptLoadPromise = Promise.reject(new Error('AdSense client not configured'));
    return scriptLoadPromise;
  }

  // If the script tag was injected by a previous SPA navigation, reuse it.
  const existing = document.querySelector(`script[src^="${ADSENSE_SRC_PREFIX}"]`);
  if (existing) {
    scriptLoadPromise = Promise.resolve();
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `${ADSENSE_SRC_PREFIX}?client=${encodeURIComponent(client)}`;
    script.setAttribute('data-ad-client', client);
    script.onload = () => {
      log('AdSense script loaded.');
      resolve();
    };
    script.onerror = (err) => {
      warn('AdSense script failed to load (likely blocked by an extension).', err);
      // Reset so a future consent grant can retry once.
      scriptLoadPromise = null;
      reject(err);
    };
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
};

/**
 * Push the standard adsbygoogle init for a freshly-rendered <ins> element.
 * Safe to call after the slot is mounted; errors are swallowed in production.
 */
export const pushAd = () => {
  try {
    if (typeof window === 'undefined') return;
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  } catch (err) {
    warn('adsbygoogle.push failed:', err);
  }
};
