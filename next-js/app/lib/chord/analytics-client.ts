"use client";

import { ChordAnalytics } from "@chordcommerce/analytics";

import cartFormatter from "./formatters/cart";
import checkoutFormatter from "./formatters/checkout";
import lineItemFormatter from "./formatters/line-item-formatter";
import productFormatter from "./formatters/product";

import type { AnalyticsChordInputs } from "./analytics-types";
import type { ChordAnalyticsOptions } from "@chordcommerce/analytics";

export const createChordOptions = (
  currency: string,
  locale: string
): ChordAnalyticsOptions => ({
  cdpDomain: process.env.NEXT_PUBLIC_CHORD_CDP_DOMAIN,
  cdpWriteKey: process.env.NEXT_PUBLIC_CHORD_CDP_WRITE_KEY,

  debug: true,
  enableLogging: true,
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
      omsId: process.env.NEXT_PUBLIC_CHORD_OMS_ID || "",
      storeId: process.env.NEXT_PUBLIC_CHORD_STORE_ID || "",
      tenantId: process.env.NEXT_PUBLIC_CHORD_TENANT_ID || "",
    },
    platform: {
      name: "chord",
      type: "web",
    },
    store: {
      domain: "https://example.com",
    },
  },
});

export const createChordClient = (
  currency: string,
  locale: string
): ChordAnalytics<AnalyticsChordInputs> => {
  const options = createChordOptions(currency, locale);
  return new ChordAnalytics<AnalyticsChordInputs>(options);
};
