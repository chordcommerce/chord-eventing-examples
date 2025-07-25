import {Link, useNavigate} from 'react-router';

import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';

import {SellingPlanSelector} from '~/components/SellingPlanSelector';

export function ProductForm({
  productOptions,
  selectedVariant,
  sellingPlanGroups,
  selectedSellingPlan,
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  return (
    <div className="product-form">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options" key={option.name}>
            <h5>{option.name}</h5>
            <div className="product-options-grid">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  // SEO
                  // When the variant is a combined listing child product
                  // that leads to a different url, we need to render it
                  // as an anchor tag
                  return (
                    <Link
                      className="product-options-item"
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      style={{
                        border: selected
                          ? '1px solid black'
                          : '1px solid transparent',
                        opacity: available ? 1 : 0.3,
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  // SEO
                  // When the variant is an update to the search param,
                  // render it as a button with javascript navigating to
                  // the variant so that SEO bots do not index these as
                  // duplicated links
                  return (
                    <button
                      type="button"
                      className={`product-options-item${
                        exists && !selected ? ' link' : ''
                      }`}
                      key={option.name + name}
                      style={{
                        border: selected
                          ? '1px solid black'
                          : '1px solid transparent',
                        opacity: available ? 1 : 0.3,
                      }}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
            <br />
          </div>
        );
      })}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>

      {sellingPlanGroups.nodes.length > 0 ? (
        <>
          <br />
          <hr />
          <br />
          <h3>Subscription Options</h3>
          <SellingPlanSelector
            sellingPlanGroups={sellingPlanGroups}
            selectedSellingPlan={selectedSellingPlan}
            selectedVariant={selectedVariant}
          >
            {({sellingPlanGroup}) => (
              <SellingPlanGroup
                key={sellingPlanGroup.name}
                sellingPlanGroup={sellingPlanGroup}
              />
            )}
          </SellingPlanSelector>
          <br />
          <AddToCartButton
            disabled={!selectedSellingPlan}
            onClick={() => {
              open('cart');
            }}
            lines={
              selectedSellingPlan && selectedVariant
                ? [
                    {
                      quantity: 1,
                      selectedVariant,
                      sellingPlanId: selectedSellingPlan.id,
                      merchandiseId: selectedVariant.id,
                    },
                  ]
                : []
            }
          >
            {selectedSellingPlan ? 'Subscribe' : 'Select Subscription'}
          </AddToCartButton>
        </>
      ) : null}
    </div>
  );
}

function ProductOptionSwatch({swatch, name}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}

// Update as you see fit to match your design and requirements
function SellingPlanGroup({sellingPlanGroup}) {
  return (
    <div className="selling-plan-group" key={sellingPlanGroup.name}>
      <p className="selling-plan-group-title">
        <strong>{sellingPlanGroup.name}:</strong>
      </p>
      {sellingPlanGroup.sellingPlans.nodes.map((sellingPlan) => {
        return (
          <Link
            key={sellingPlan.id}
            prefetch="intent"
            to={sellingPlan.url}
            className={`selling-plan ${
              sellingPlan.isSelected ? 'selected' : 'unselected'
            }`}
            preventScrollReset
            replace
          >
            <p>
              {sellingPlan.options.map(
                (option) => `${option.name} ${option.value}`,
              )}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
