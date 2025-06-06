import {parseGid, useAnalytics} from '@shopify/hydrogen';
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

    subscribe('cart_updated', (data) => {
      const {prevCart, cart} = data;

      if (!cart || !prevCart) return;

      const variantIdsInCart = cart.lines.nodes.map(
        (line) => line.merchandise.id,
      );
      const variantIdsInPrevCart = prevCart.lines.nodes.map(
        (line) => line.merchandise.id,
      );

      const uniqueVariantIdsInCart = [...new Set(variantIdsInCart)];
      const uniqueVariantIdsInPrevCart = [...new Set(variantIdsInPrevCart)];

      const isAdd =
        uniqueVariantIdsInCart.length > uniqueVariantIdsInPrevCart.length;

      // cart updated but count of unique variant IDs is the same in each state - this is a change of quantity and is not considered an add/remove
      if (uniqueVariantIdsInCart.length === uniqueVariantIdsInPrevCart.length) {
        return;
      }

      if (isAdd) {
        const currentLine = cart.lines.nodes[0];
        chord?.trackProductAdded({
          cart,
          product: {
            product: currentLine,
            quantity: currentLine?.quantity,
            variantId: parseGid(currentLine?.merchandise?.id)?.id,
          },
        });
      } else {
        const prevLine = prevCart.lines.nodes[0];
        chord?.trackProductRemoved({
          cart,
          lineItem: prevLine,
        });
      }
    });

    subscribe('cart_viewed', (data) => {
      const {cart} = data;
      if (!cart) return;
      chord?.trackCartViewed({cart});
    });

    subscribe('product_viewed', (data = {}) => {
      const {cart, products} = data;
      const product = products?.[0];
      if (!product) return;

      chord.trackProductViewed({
        cart,
        product: {
          product,
          quantity: product.quantity,
          variantId: product.variantId,
        },
      });
    });

    subscribe('collection_viewed', (data = {}) => {
      const {collection, customData} = data;

      if (!collection) return;
      const {products} = customData || {};

      chord.trackProductListViewed({
        listId: parseGid(collection.id)?.id,
        listName: collection.handle,
        products: products.map((product) => ({
          product,
          quantity: product.quantity,
          variantId: product.variantId,
        })),
      });
    });

    subscribe('custom_promo_code_denied', (data = {}) => {
      const {cart, customData} = data;

      chord.trackCouponDenied({
        cartId: parseGid(cart?.id)?.id,
        couponName: customData?.promoCode,
        reason: customData?.reason,
      });
    });

    subscribe('custom_promo_code_applied', (data = {}) => {
      const {cart, customData} = data;

      chord.trackCouponApplied({
        cartId: parseGid(cart?.id)?.id,
        couponName: customData?.promoCode,
      });
    });

    subscribe('custom_promo_code_entered', (data = {}) => {
      const {cart, customData} = data;

      chord.trackCouponEntered({
        cartId: parseGid(cart?.id)?.id,
        couponName: customData?.promoCode,
      });
    });

    subscribe('custom_promo_code_removed', (data = {}) => {
      const {cart, customData} = data;

      chord.trackCouponRemoved({
        cartId: parseGid(cart?.id)?.id,
        couponName: customData?.promoCode,
      });
    });

    subscribe('custom_product_clicked', (data = {}) => {
      const {cart, customData} = data;
      const {listId, listName, products} = customData || {};
      const product = products?.[0];
      if (!product) return;

      chord.trackProductClicked({
        cart,
        listId,
        listName,
        product: {
          product,
          quantity: product.quantity,
          variantId: product.variantId,
        },
      });
    });
  }, []);

  return null;
}
