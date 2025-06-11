import lineItemFormatter from './line-item-formatter'

import type { AnalyticsCartInput } from '../analytics-types'
import type { CartFormatter } from '@chordcommerce/analytics'

const cartFormatter: CartFormatter<AnalyticsCartInput> = ({ cart }) => {
  return {
    cart_id: cart.cartId,
    currency: cart.currency,
    products:
      cart.products?.map((product, i) => ({
        ...lineItemFormatter({ lineItem: product }),
        position: i + 1,
      })) ?? [],
    value: cart.value,
  }
}

export default cartFormatter
