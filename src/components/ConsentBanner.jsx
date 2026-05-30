import React, { useState } from 'react';
import { setAdvertisingConsent } from '../utils/consent';
import { isAdsEnabled } from '../utils/adsense';
import '../styles/AdSenseBanner.css';

/**
 * Minimal advertising-consent banner. Hides itself once the user has either
 * accepted or rejected, and never renders when ads aren't enabled at all
 * (so it stays out of the way in local dev).
 *
 * Replace with a full CMP for production GDPR compliance.
 */
const ConsentBanner = () => {
  const [decided, setDecided] = useState(
    typeof window !== 'undefined' && window.localStorage.getItem('adConsent') !== null
  );

  if (!isAdsEnabled() || decided) return null;

  const decide = (granted) => {
    setAdvertisingConsent(granted);
    setDecided(true);
  };

  return (
    <div className="consent-banner" role="dialog" aria-live="polite">
      <p>
        We use cookies and advertising partners to support this site. You can choose
        whether to allow personalized ads.
      </p>
      <div className="consent-actions">
        <button type="button" className="consent-secondary" onClick={() => decide(false)}>
          Reject
        </button>
        <button type="button" className="consent-primary" onClick={() => decide(true)}>
          Accept
        </button>
      </div>
    </div>
  );
};

export default ConsentBanner;
