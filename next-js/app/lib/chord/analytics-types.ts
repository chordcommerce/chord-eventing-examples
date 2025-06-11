export type AnalyticsCartInput = {
  cartId?: string;
  currency?: string;
  products?: AnalyticsLineItemInput[];
  value?: number;
};

export type AnalyticsCheckoutInput = {
  checkoutType: string;
  orderId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[];
  value?: number;
  shipping?: number;
};

export type AnalyticsLineItemInput = AnalyticsProductInput & {
  quantity: number;
};

export type AnalyticsProductInput = {
  id: string;
  brand?: string;
  name: string;
  price: number;
  sku: string;
  categories?: string[] | null;
  categories_count?: number | null;
  categories_text?: string | null;
  color?: string | null;
  size?: string | null;
  description?: string | null;
  images?: string[] | null;
  oms_product_id?: string | null;
  url?: string | null;
};

export type AnalyticsChordInputs = {
  Cart: AnalyticsCartInput;
  Checkout: AnalyticsCheckoutInput;
  LineItem: AnalyticsLineItemInput;
  Product: AnalyticsProductInput;
};
