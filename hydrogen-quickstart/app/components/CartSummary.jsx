import {CartForm, Money, useAnalytics} from '@shopify/hydrogen';
import {useRef, useState, useEffect} from 'react';
import {useChordIdentifiers} from '~/hooks/useChordIdentifiers';

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  useChordIdentifiers(cart);

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <h4>Totals</h4>
      <dl className="cart-subtotal">
        <dt>Subtotal</dt>
        <dd>
          {cart.cost?.subtotalAmount?.amount ? (
            <Money data={cart.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      <CartDiscounts discountCodes={cart.discountCodes} />
      <CartGiftCard giftCardCodes={cart.appliedGiftCards} />
      <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
    </div>
  );
}

export default function AttributeUpdateForm() {
  const [sscid, setSscid] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSscid(urlParams.get('sscid') || '');

    if (!sscid) {
      return;
    }

    const button = document.getElementById('update-attributes-button');
    if (button) {
      button.click();
    }
  }, [sscid]);

  return (
    <CartForm
      id="auto-attribute-update-form"
      route="/cart"
      action={CartForm.ACTIONS.AttributesUpdateInput}
      inputs={{attributes: [{key: 'sscid', value: sscid}]}}
      style={{display: 'none'}}
    >
      <button
        id="update-attributes-button"
        type="submit"
        style={{display: 'none'}}
      >
        Update attribute
      </button>
    </CartForm>
  );
}

/**
 * @param {{checkoutUrl?: string}}
 */
function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <>
      <AttributeUpdateForm />
      <div>
        <a href={checkoutUrl} target="_self">
          <p>Continue to Checkout &rarr;</p>
        </a>
        <br />
      </div>
    </>
  );
}

/**
 * @param {{
 *   discountCodes?: CartApiQueryFragment['discountCodes'];
 * }}
 */
function CartDiscounts({discountCodes}) {
  const {publish, cart: analyticsCart} = useAnalytics();
  const [codeTyped, setCodeTyped] = useState('');
  const [lastSubmittedCode, setLastSubmittedCode] = useState('');

  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            {() => {
              const handleRemove = (codes) => {
                publish('custom_promo_code_removed', {
                  cart: analyticsCart,
                  customData: {promoCode: codes},
                });
              };

              return (
                <div className="cart-discount">
                  <code>{codes?.join(', ')}</code>
                  &nbsp;
                  <button onClick={() => handleRemove(codes?.join(', '))}>
                    Remove
                  </button>
                </div>
              );
            }}
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        {() => {
          const handleApply = () => {
            publish('custom_promo_code_entered', {
              cart: analyticsCart,
              customData: {promoCode: codeTyped},
            });
            setLastSubmittedCode(codeTyped);
          };

          useEffect(() => {
            if (!lastSubmittedCode) return;

            const submittedCodeEntry = analyticsCart.discountCodes.find(
              (c) => c.code.toLowerCase() === lastSubmittedCode.toLowerCase(),
            );

            if (submittedCodeEntry) {
              if (submittedCodeEntry.applicable) {
                setCodeTyped('');

                publish('custom_promo_code_applied', {
                  cart: analyticsCart,
                  customData: {promoCode: lastSubmittedCode},
                });
              } else {
                publish('custom_promo_code_denied', {
                  cart: analyticsCart,
                  customData: {
                    promoCode: lastSubmittedCode,
                    reason: 'not_applicable',
                  },
                });
              }
            }
          }, [lastSubmittedCode, publish, analyticsCart]);

          return (
            <div>
              <input
                type="text"
                name="discountCode"
                placeholder="Discount code"
                onChange={(e) => setCodeTyped(e.target.value)}
              />
              &nbsp;
              <button onClick={() => handleApply()} type="submit">
                Apply
              </button>
            </div>
          );
        }}
      </UpdateDiscountForm>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
 * }}
 */
function CartGiftCard({giftCardCodes}) {
  const appliedGiftCardCodes = useRef([]);
  const giftCardCodeInput = useRef(null);
  const codes =
    giftCardCodes?.map(({lastCharacters}) => `***${lastCharacters}`) || [];

  function saveAppliedCode(code) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    giftCardCodeInput.current.value = '';
  }

  function removeAppliedCode() {
    appliedGiftCardCodes.current = [];
  }

  return (
    <div>
      {/* Have existing gift card applied, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Applied Gift Card(s)</dt>
          <UpdateGiftCardForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button onSubmit={() => removeAppliedCode}>Remove</button>
            </div>
          </UpdateGiftCardForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
      >
        <div>
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
          />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

/**
 * @param {{
 *   giftCardCodes?: string[];
 *   saveAppliedCode?: (code: string) => void;
 *   removeAppliedCode?: () => void;
 *   children: React.ReactNode;
 * }}
 */
function UpdateGiftCardForm({giftCardCodes, saveAppliedCode, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code);
        }
        return children;
      }}
    </CartForm>
  );
}

/**
 * @typedef {{
 *   cart: OptimisticCart<CartApiQueryFragment | null>;
 *   layout: CartLayout;
 * }} CartSummaryProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCart} OptimisticCart */
