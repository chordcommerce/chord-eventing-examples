# Shopify Hydrogen/Chord Analytics Eventing Template

Hydrogen is Shopify’s stack for headless commerce.

[Check out Hydrogen's docs](https://shopify.dev/custom-storefronts/hydrogen)
[Check out Chord's Tracking Plan docs](https://docs.chord.co/tracking-plan)

### Getting started

**Requirements:**

- Node.js version 18.0.0 or higher

### Local development

```bash
npm run dev
```

## Chord Analytics Integration

**Relevant Documentation:**

- Hydrogen [Analytics events tracking] documentation (<https://shopify.dev/docs/storefronts/headless/hydrogen/analytics/tracking?framework=hydrogen&extension=javascript>
  )

- Hydroden's [`useAnalytics`](https://shopify.dev/docs/api/hydrogen/2024-04/hooks/useanalytics) hook documentation

### Installation

The Chord Analytics integration is installed as a dependency:

```
npm install @chordcommerce/analytics
```

### Configuration

Configure your `.env` with the following values:

```
PUBLIC_CHORD_OMS_ID: chord to provide
PUBLIC_CHORD_STORE_ID: chord to provide
PUBLIC_CHORD_TENANT_ID: chord to provide
PUBLIC_CHORD_CDP_DOMAIN: https://production.cdp.ingest.chord.co | https://development.cdp.ingest.chord.co | https://staging.cdp.ingest.chord.co
PUBLIC_CHORD_CDP_WRITE_KEY: chord to provide
PUBLIC_CHECKOUT_DOMAIN: [your-store].myshopify.com
```

### Implementation

1. **Client Creation** - `app/lib/chord.js`

The Chord Analytics client is created using the createChordClient function, which initializes the ChordAnalytics instance with custom formatters.

```
export const createChordClient = (props) => {
  if (typeof window !== 'undefined') {
    const options = createChordOptions({...props});
    return new ChordAnalytics(options);
  }
};
```

NOTE: The typeof window !== 'undefined' check is needed because this code runs in both server-side and client-side environments in a Hydrogen/React Router application.

2. **Analytics Component** - `app/components/ChordAnalytics.jsx`

The Chord Analytics functionality is delegated to a single Analytics component for analytics events subscription using Hydroden's `useAnalytics` hook:

3. **Root Integration** - `app/root.jsx`

Add a `chord` key to the object returned from the exported loader function in the `app/root.tsx` file:

```
  chord: {
    domain: env.PUBLIC_STORE_DOMAIN,
    omsId: env.PUBLIC_CHORD_OMS_ID,
    storeId: env.PUBLIC_CHORD_STORE_ID,
    tenantId: env.PUBLIC_CHORD_TENANT_ID,
    cdpDomain: env.PUBLIC_CHORD_CDP_DOMAIN,
    cdpWriteKey: env.PUBLIC_CHORD_CDP_WRITE_KEY,
  }
```

That data is later accessed in the Layout component with:

```
const data = useRouteLoaderData('root');
```

And subsequently used within the Chord Analytics component at the root level of the application like so:

```
<Analytics.Provider cart={data.cart}>
  {data.chord && (
    <ChordAnalytics
      currency="USD"
      domain={data.chord.domain}
      locale="en-US"
      omsId={data.chord.omsId}
      storeId={data.chord.storeId}
      tenantId={data.chord.tenantId}
      cdpDomain={data.chord.cdpDomain}
      cdpWriteKey={data.chord.cdpWriteKey}
    />
  )}
  <PageLayout {...data}>{children}</PageLayout>
</Analytics.Provider>
```

4. **Content Security Policy Configuration** - `app/entry.server.tsx`

Add the Chord CDP Domain and the domains of any device mode destiantions to the relevant CSP directives

```
connectSrc: [
  // ... other domains
  'https://production.cdp.ingest.chord.co',
  // ... other domains
]
```

This allows the Hydrogen application to make network requests to the Chord analytics ingestion endpoint.

```
scriptSrc: [
  // ... other domains
  'https://production.cdp.ingest.chord.co',
  // ... other domains
],
```

This allows the application to load and execute JavaScript from the Chord domain.

The CSP configuration ensures that:

- The application can send analytics data to Chord's servers
- Chord's JavaScript tracking code can be loaded and executed
- These operations are explicitly allowed by the browser's security policy

5. **Add the** `useChordIdentifiers` **hook** - `app/hooks/useChordIdentifiers`

This is a custom hook designed to capture and store user identification data from browser cookies into the Shopify cart attributes. This enables the CDP to associate anonymous users with cart sessions.

Please see the implementation of the hook in `app/components/CartSummary` - every time a user views their cart summary, the system automatically:
Checks if there are any new user identifiers in browser cookies and
compares/updates them with what's already stored in the cart.

The code of the hook relies on two exported functions from `app/lib/utils.js`:

- `getCookie`
- `combineCartAttributes`

## Event Tracking Examples

**Page Views**

```
 subscribe('page_viewed', () => {
    chord.page();
  });
```

The subscribe function comes from Hydrogen's useAnalytics() hook. Hydrogen automatically emits a 'page_viewed' event when the use navigates pages. When that event fires, it calls chord.page() in it's callback function to track the page view in Chord.

**Track Events**

```
subscribe('cart_viewed', (data) => {
  const {cart} = data;
  if (!cart) return;
  chord?.trackCartViewed({cart});
});
```

When a user navigates to the cart page in the Hydrogen storefront, Hydrogen automatically emits a 'cart_viewed' event. `chord.trackCartViewed({cart})` calls Chord Analytics' trackCartViewed method with the cart data.

**Custom Track and Indetify Events**

See the following custom event subscription:

```
subscribe('custom_email_subscribed', (data) => {
  const {customData} = data;
  if (!customData) return;

  chord.identify({
    email: customData.email,
  });

  chord.trackEmailCaptured({
    email: customData.email,,
    placementComponent: customData.location,
  });
});
```

The above code would correspond with a publication of the custom event like so:

```
publish('custom_email_subscribed', {
  customData: {
    email,
    location: 'notify me',
  },
});
```
