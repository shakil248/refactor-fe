import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getAdSenseClient,
  isAdsEnabled,
  loadAdSenseScript,
  pushAd,
} from '../utils/adsense';
import { hasAdvertisingConsent, onConsentChange } from '../utils/consent';
import { trackAdClick, trackAdImpression } from '../utils/analytics';
import '../styles/AdSenseBanner.css';

/**
 * Reusable Google AdSense ad slot.
 *
 * Props:
 *  - adSlot     (required) Numeric slot ID configured in your AdSense account.
 *  - adFormat   Defaults to "auto". Pass e.g. "fluid" for in-feed ads.
 *  - adLayout   Optional layout key (e.g. "in-article").
 *  - responsive Defaults to true. Sets data-full-width-responsive.
 *  - className  Extra wrapper class for layout-specific spacing.
 */
const AdSenseBanner = ({
  adSlot,
  adFormat = 'auto',
  adLayout,
  responsive = true,
  className = '',
}) => {
  const insRef = useRef(null);
  const initializedRef = useRef(false);
  const location = useLocation();

  // Track consent changes so the component shows up if the user grants later.
  const [consentGranted, setConsentGranted] = useState(hasAdvertisingConsent);

  useEffect(() => onConsentChange(setConsentGranted), []);

  const enabled = isAdsEnabled() && consentGranted;
  const client = getAdSenseClient();

  // Reset initialization on route change so the next render re-pushes a fresh
  // slot — adsbygoogle does not allow pushing into the same <ins> twice.
  useEffect(() => {
    initializedRef.current = false;
  }, [location.pathname, adSlot]);

  // Load the script once and initialize this slot.
  useEffect(() => {
    if (!enabled || !adSlot || initializedRef.current) return;
    let cancelled = false;

    loadAdSenseScript()
      .then(() => {
        if (cancelled || initializedRef.current) return;
        // Guard against double-init when React StrictMode invokes effects twice.
        if (insRef.current && insRef.current.getAttribute('data-adsbygoogle-status')) {
          return;
        }
        pushAd();
        initializedRef.current = true;
        trackAdImpression({ adSlot, adFormat });
      })
      .catch(() => {
        // loader already logged in dev; in prod we fail silently
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, adSlot, adFormat, location.pathname]);

  if (!enabled || !adSlot) return null;

  const handleClick = () => trackAdClick({ adSlot, adFormat });

  return (
    <div
      className={`adsense-banner ${className}`.trim()}
      data-ad-slot={adSlot}
      onClick={handleClick}
      role="complementary"
      aria-label="Advertisement"
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        {...(adLayout ? { 'data-ad-layout': adLayout } : {})}
        {...(responsive ? { 'data-full-width-responsive': 'true' } : {})}
      />
    </div>
  );
};

export default AdSenseBanner;
