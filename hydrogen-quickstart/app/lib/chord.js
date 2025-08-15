import {ChordAnalytics} from '@chordcommerce/analytics';
import {parseGid} from '@shopify/hydrogen';

const productFormatter = ({position, product, quantity, variantId}) => {
  if (product.merchandise) {
    return lineItemFormatter({lineItem: product});
  }

  return {
    brand: product?.vendor,
    category: product?.productType,
    name: product?.title,
    position,
    price: Number(product?.price) || 0,
    product_id: parseGid(product?.id)?.id || undefined,
    quantity,
    sku: product?.sku,
    slug: product?.handle,
    variant: product?.variantTitle,
    variant_id: parseGid(variantId)?.id || undefined,
    image_url: product?.image,
  };
};

const lineItemFormatter = ({lineItem}) => {
  const discount = lineItem?.discountAllocations?.find(
    ({discountedAmount}) => Number(discountedAmount?.amount) > 0,
  );

  return {
    brand: lineItem?.merchandise?.product?.vendor,
    category: lineItem?.merchandise?.product?.productType,
    coupon: discount?.code || discount?.title,
    image_url: lineItem?.merchandise?.image?.url,
    line_item_id: parseGid(lineItem?.id)?.id || undefined,
    name: lineItem?.merchandise?.product?.title,
    option_values: lineItem?.merchandise?.selectedOptions?.map(
      ({name, value}) => `${name}${value}`,
    ),
    price: Number(lineItem?.cost?.amountPerQuantity?.amount) || 0,
    product_id: parseGid(lineItem?.merchandise?.product?.id)?.id || undefined,
    quantity: lineItem?.quantity,
    sku: lineItem?.merchandise?.sku,
    slug: lineItem?.merchandise?.product?.handle,
    variant: lineItem?.merchandise?.title,
    variant_id: parseGid(lineItem?.merchandise?.id)?.id || undefined,
  };
};

const cartFormatter = ({cart}) => {
  const discount = cart?.discountAllocations?.find(
    ({discountedAmount}) => Number(discountedAmount?.amount) > 0,
  );

  return {
    cart_id: parseGid(cart?.id)?.id || undefined,
    currency: cart?.totalAmount?.currencyCode,
    products: cart?.lines?.nodes?.map(({node}, i) => {
      const item = lineItemFormatter({lineItem: node});
      return {
        ...item,
        coupon: item.coupon || discount?.code || discount?.title,
        position: i + 1,
      };
    }),
    value: cart?.totalAmount?.amount,
  };
};

const checkoutFormatter = ({checkout}) => checkout;

const createChordOptions = ({
  currency,
  domain,
  locale,
  omsId,
  storeId,
  tenantId,
  cdpDomain,
  cdpWriteKey,
}) => ({
  consent: 'shopify',
  awaitConsent: false,
  cdpDomain,
  cdpWriteKey,
  formatters: {
    objects: {
      cart: cartFormatter,
      checkout: checkoutFormatter,
      lineItem: lineItemFormatter,
      product: productFormatter,
    },
  },
  metadata: {
    i18n: {
      currency,
      locale,
    },
    ownership: {
      omsId,
      storeId,
      tenantId,
    },
    platform: {
      name: 'Shopify',
      type: 'web',
    },
    store: {
      domain,
    },
  },
});

export const createChordClient = (props) => {
  if (typeof window !== 'undefined') {
    const options = createChordOptions({...props});
    return new ChordAnalytics(options);
  }
};
