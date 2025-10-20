This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

This project demonstrates how to integrate the **@chordcommerce/analytics** package for tracking e-commerce events in a Next.js application.

## Chord Analytics Integration

### Installation

Install the @chordcommerce/analytics package:

```bash
npm install @chordcommerce/analytics
# or
yarn add @chordcommerce/analytics
# or
pnpm add @chordcommerce/analytics
```

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```bash
# Required
NEXT_PUBLIC_CHORD_CDP_DOMAIN="https://staging.cdp.ingest.chord.co"
NEXT_PUBLIC_CHORD_CDP_WRITE_KEY="your-write-key-here"

# Optional
NEXT_PUBLIC_CHORD_OMS_ID=""
NEXT_PUBLIC_CHORD_STORE_ID=""
NEXT_PUBLIC_CHORD_TENANT_ID=""
```

### Basic Usage

#### 1. Initialize the Analytics Client

Create a client initialization file (e.g., `app/lib/chord/analytics-client.ts`):

```typescript
import { ChordAnalytics } from "@chordcommerce/analytics";
import type { ChordAnalyticsOptions } from "@chordcommerce/analytics";

export const createChordClient = (
  currency: string,
  locale: string
): ChordAnalytics => {
  const options: ChordAnalyticsOptions = {
    cdpDomain: process.env.NEXT_PUBLIC_CHORD_CDP_DOMAIN,
    cdpWriteKey: process.env.NEXT_PUBLIC_CHORD_CDP_WRITE_KEY,
    formatters: {
      objects: {
        // Add custom formatters for your data types
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
  };

  return new ChordAnalytics(options);
};
```

#### 2. Create the Analytics Hook

Create a custom hook to access the analytics client (e.g., `app/hooks/useChord.ts`):

```typescript
"use client";

import { createContext, useContext } from "react";
import type { ChordAnalytics } from "@chordcommerce/analytics";

export const ChordAnalyticsContext = createContext<ChordAnalytics>(undefined!);
ChordAnalyticsContext.displayName = "ChordAnalyticsContext";

export function useChord() {
  return useContext(ChordAnalyticsContext);
}
```

#### 3. Set Up React Context Provider

Wrap your application with the Chord Analytics provider (e.g., `app/contexts/chord-context.tsx`):

```typescript
"use client";

import { useEffect, useMemo, useState } from "react";
import { ChordAnalyticsContext } from "../hooks/useChord";
import { createChordClient } from "../lib/chord";

export const ChordProvider = ({ children }: { children: React.ReactNode }) => {
  const currency = "USD";
  const locale = "en-US";
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const chord = useMemo(() => {
    if (!isClient) return null;
    return createChordClient(currency, locale);
  }, [isClient, currency, locale]);

  if (!chord) {
    return <>{children}</>;
  }

  return (
    <ChordAnalyticsContext.Provider value={chord}>
      {children}
    </ChordAnalyticsContext.Provider>
  );
};
```

#### 4. Use the Analytics Hook in Components

Access the analytics client in your components:

```typescript
import { useChord } from '../hooks/useChord'

export function ProductPage({ product }) {
  const chord = useChord()

  useEffect(() => {
    if (chord && product) {
      chord.trackProductViewed({
        product: {
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            sku: product.sku,
            brand: product.brand,
          },
          quantity: 1,
          variantId: product.sku,
        },
        cart: {},
      })
    }
  }, [chord, product])

  return (
    // Your component JSX
  )
}
```
