import {Money} from '@shopify/hydrogen';

export function ProductPrice({
  price,
  compareAtPrice,
  selectedSellingPlan,
  selectedVariant,
}) {
  if (selectedSellingPlan) {
    return (
      <SellingPlanPrice
        selectedSellingPlan={selectedSellingPlan}
        selectedVariant={selectedVariant}
      />
    );
  }

  return (
    <div className="product-price">
      {compareAtPrice ? (
        <div className="product-price-on-sale">
          {price ? <Money data={price} /> : null}
          <s>
            <Money data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}

/*
  Render the selected selling plan price is available
*/
function SellingPlanPrice({selectedSellingPlan, selectedVariant}) {
  if (!selectedVariant) {
    return null;
  }

  const sellingPlanPriceAdjustments = selectedSellingPlan?.priceAdjustments;

  if (!sellingPlanPriceAdjustments?.length) {
    return selectedVariant ? <Money data={selectedVariant.price} /> : null;
  }

  const selectedVariantPrice = {
    amount: parseFloat(selectedVariant.price.amount),
    currencyCode: selectedVariant.price.currencyCode,
  };

  const sellingPlanPrice = sellingPlanPriceAdjustments.reduce(
    (acc, adjustment) => {
      switch (adjustment.adjustmentValue.__typename) {
        case 'SellingPlanFixedAmountPriceAdjustment':
          return {
            amount:
              acc.amount +
              parseFloat(adjustment.adjustmentValue.adjustmentAmount.amount),
            currencyCode: acc.currencyCode,
          };
        case 'SellingPlanFixedPriceAdjustment':
          return {
            amount: parseFloat(adjustment.adjustmentValue.price.amount),
            currencyCode: acc.currencyCode,
          };
        case 'SellingPlanPercentagePriceAdjustment':
          return {
            amount:
              acc.amount *
              (1 - adjustment.adjustmentValue.adjustmentPercentage / 100),
            currencyCode: acc.currencyCode,
          };
        default:
          return acc;
      }
    },
    selectedVariantPrice,
  );

  return (
    <div className="selling-plan-price">
      <Money
        data={{
          amount: `${sellingPlanPrice.amount}`,
          currencyCode: sellingPlanPrice.currencyCode,
        }}
      />
    </div>
  );
}
