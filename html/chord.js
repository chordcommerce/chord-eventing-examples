const _waitForChordCdpReady = () => {
  return new Promise((resolve) => {
    const checkCdpReady = () => {
      const cdp = window[`_chord`];
      if (cdp && typeof cdp.configure === "function") {
        resolve();
      } else {
        setTimeout(checkCdpReady, 50);
      }
    };
    checkCdpReady();
  });
};

const options = {
  metadata: {
    ownership: {
      omsId: "123",
      storeId: "123",
      tenantId: "123",
    },
  },
};

const meta = () => {
  return {
    ...options.metadata,
    ownership: {
      oms_id: options.metadata?.ownership?.omsId,
      store_id: options.metadata?.ownership?.storeId,
      tenant_id: options.metadata?.ownership?.tenantId,
    },
    version: {
      major: 3,
      minor: 0,
      patch: 0,
    },
  };
};

const pageProps = {
  meta: meta(),
};

const _chordPage = () => {
  window._chord.page(pageProps);
};

const _chordTrack = (event, props) => {
  window._chord.track(event, {
    ...props,
    ...pageProps,
  });
};
