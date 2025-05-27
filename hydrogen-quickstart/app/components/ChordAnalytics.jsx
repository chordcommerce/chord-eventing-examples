import {useAnalytics} from '@shopify/hydrogen';
import {useEffect, useMemo} from 'react';
import {createChordClient} from '../lib/chord';

export function ChordAnalytics({
  currency,
  domain,
  locale,
  omsId,
  storeId,
  tenantId,
  cdpDomain,
  cdpWriteKey,
}) {
  const {subscribe} = useAnalytics();

  const chord = useMemo(() => {
    return createChordClient({
      currency,
      domain,
      locale,
      omsId,
      storeId,
      tenantId,
      cdpDomain,
      cdpWriteKey,
    });
  }, []);

  useEffect(() => {
    subscribe('page_viewed', () => {
      chord.page();
    });

    subscribe('product_viewed', (data) => {
      console.log('ChordAnalytics - Product viewed:', data);
    });
    subscribe('collection_viewed', (data) => {
      console.log('ChordAnalytics - Collection viewed:', data);
    });
    subscribe('cart_viewed', (data) => {
      console.log('ChordAnalytics - Cart viewed:', data);
    });
    subscribe('cart_updated', (data) => {
      console.log('ChordAnalytics - Cart updated:', data);
    });
  }, []);

  return null;
}
