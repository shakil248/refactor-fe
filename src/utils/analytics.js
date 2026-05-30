/**
 * Thin GA4 event wrapper. If `window.gtag` is not present (no GA4 snippet on
 * the page) the calls become no-ops so the app keeps working.
 *
 * To enable: add the standard gtag.js snippet to public/index.html with your
 * Measurement ID, e.g.:
 *   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>
 *   <script>
 *     window.dataLayer = window.dataLayer || [];
 *     function gtag(){ dataLayer.push(arguments); }
 *     gtag('js', new Date());
 *     gtag('config', 'G-XXXX');
 *   </script>
 */

const isDevelopment = () => process.env.NODE_ENV === 'development';

const sendEvent = (name, params) => {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    } else if (isDevelopment()) {
      console.log('[analytics:no-gtag]', name, params);
    }
  } catch (err) {
    if (isDevelopment()) console.warn('[analytics] event failed', err);
  }
};

export const trackAdImpression = ({ adSlot, adFormat }) => {
  sendEvent('ad_impression', {
    ad_slot: adSlot,
    ad_format: adFormat,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    timestamp: Date.now(),
  });
};

export const trackAdClick = ({ adSlot, adFormat }) => {
  sendEvent('ad_click', {
    ad_slot: adSlot,
    ad_format: adFormat,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    timestamp: Date.now(),
  });
};
