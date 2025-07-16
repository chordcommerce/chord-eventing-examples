import {useMemo} from 'react';
import {useLocation} from 'react-router';

/**
 * A component that simplifies selecting sellingPlans subscription options
 * @example Example use
 * ```ts
 *   <SellingPlanSelector
 *     sellingPlanGroups={sellingPlanGroups}
 *     selectedSellingPlanId={selectedSellingPlanId}
 *   >
 *     {({sellingPlanGroup}) => ( ...your sellingPlanGroup component )}
 *  </SellingPlanSelector>
 *  ```
 **/
export function SellingPlanSelector({
  sellingPlanGroups,
  selectedSellingPlan,
  children,
  paramKey = 'selling_plan',
  selectedVariant,
}) {
  const {search, pathname} = useLocation();
  const params = new URLSearchParams(search);

  const planAllocationIds =
    selectedVariant?.sellingPlanAllocations.nodes.map(
      (node) => node.sellingPlan.id,
    ) ?? [];

  return useMemo(
    () =>
      sellingPlanGroups.nodes
        // Filter out groups that don't have plans usable for the selected variant
        .filter((group) => {
          return group.sellingPlans.nodes.some((sellingPlan) =>
            planAllocationIds.includes(sellingPlan.id),
          );
        })
        .map((sellingPlanGroup) => {
          // Augment each sellingPlan node with isSelected and url
          const sellingPlans = sellingPlanGroup.sellingPlans.nodes
            .map((sellingPlan) => {
              if (!sellingPlan?.id) {
                console.warn(
                  'SellingPlanSelector: sellingPlan.id is missing in the product query',
                );
                return null;
              }

              if (!sellingPlan.id) {
                return null;
              }

              params.set(paramKey, sellingPlan.id);
              sellingPlan.isSelected =
                selectedSellingPlan?.id === sellingPlan.id;
              sellingPlan.url = `${pathname}?${params.toString()}`;
              return sellingPlan;
            })
            .filter(Boolean);
          sellingPlanGroup.sellingPlans.nodes = sellingPlans;
          return children({sellingPlanGroup, selectedSellingPlan});
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      sellingPlanGroups,
      children,
      selectedSellingPlan,
      paramKey,
      pathname,
      selectedVariant,
    ],
  );
}
