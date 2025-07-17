import { ServerRouter } from 'react-router';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import { createContentSecurityPolicy } from '@shopify/hydrogen';

/**
 * @param {Request} request
 * @param {number} responseStatusCode
 * @param {Headers} responseHeaders
 * @param {EntryContext} reactRouterContext
 * @param {AppLoadContext} context
 */
export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  reactRouterContext,
  context,
) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    connectSrc: [
      "'self'",
      'https://production.cdp.ingest.chord.co',
      'https://staging.cdp.ingest.chord.co',
      'http://localhost:8080',
      'https://localhost:8080',
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://analytics.tiktok.com/',
      'https://*.facebook.com',
      'https://connect.facebook.net',
      'https://www.google.com/',
      'https://*.doubleclick.net',
      'https://www.google.com',
      'https://www.google.ca',
      'https://www.google.co.uk',
      'https://www.google.fr',
      'https://www.google.de',
      'https://www.google.com.au',
      'https://www.google.co.jp',
      'https://analytics.google.com',
      'https://stats.g.doubleclick.net',
      'https://www.googleadservices.com',
    ],
    frameSrc: [
      'https://www.googletagmanager.com',
      'https://*.facebook.com',
      'https://*.doubleclick.net',
      'https://td.doubleclick.net',
      'https://www.googletagmanager.com',
    ],
    scriptSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://localhost:8080',
      'http://localhost:8080',
      'https://production.cdp.ingest.chord.co',
      'https://staging.cdp.ingest.chord.co',
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://sneakpeek-1.s3.us-east-1.amazonaws.com',
      'https://analytics.tiktok.com/',
      'https://connect.facebook.net',
      'https://facebook.com/',
      'https://www.google.com/',
      'https://*.googletagmanager.com',
    ],
    imgSrc: [
      "'self'",
      'data:',
      'https://cdn.shopify.com',
      'https://*.facebook.com',
      'https://www.google.com/',
      'https://googleads.g.doubleclick.net',
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

/** @typedef {import('@shopify/remix-oxygen').AppLoadContext} AppLoadContext */
/** @typedef {import('react-router').EntryContext} EntryContext */
