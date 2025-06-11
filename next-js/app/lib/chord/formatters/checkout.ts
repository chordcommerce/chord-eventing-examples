import lineItemFormatter from './line-item-formatter'

import type { AnalyticsCheckoutInput } from '../analytics-types'
import type { CheckoutFormatter } from '@chordcommerce/analytics'

const checkoutFormatter: CheckoutFormatter<AnalyticsCheckoutInput> = ({
  checkout,
}) => ({
  checkout_type: checkout.checkoutType,
  order_id: checkout.orderId,
  products: checkout.products?.map((product, i) => ({
    ...lineItemFormatter({ lineItem: product }),
    position: i + 1,
  })),
  value: checkout.value,
  shipping: checkout.shipping,
})

export default checkoutFormatter
