import {useEffect} from 'react';

function useShopifyConsent() {
  useEffect(() => {
    // Check consent status whenever the Shopify object updates
    const checkConsent = () => {
      const Shopify = window.Shopify?.customerPrivacy;
      if (!Shopify) return;

      console.log({
        analytics: Shopify.analyticsProcessingAllowed(),
        marketing: Shopify.marketingAllowed(),
        preferences: Shopify.preferencesProcessingAllowed(),
        sale_of_data: Shopify.saleOfDataAllowed(),
      });
    };

    // Initial check
    checkConsent();

    // Listen for consent changes
    document.addEventListener('visitorConsentCollected', async () => {
      checkConsent();
    });
    return () =>
      document.removeEventListener('visitorConsentCollected', checkConsent);
  }, []);
}

export default useShopifyConsent;
