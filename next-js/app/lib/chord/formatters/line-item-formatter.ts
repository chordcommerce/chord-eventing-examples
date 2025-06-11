import productFormatter from './product'

import type { AnalyticsLineItemInput } from '../analytics-types'
import type { LineItemFormatter } from '@chordcommerce/analytics'

const lineItemFormatter: LineItemFormatter<AnalyticsLineItemInput> = ({
  lineItem,
}) => ({
  ...productFormatter({ product: lineItem }),
  quantity: lineItem.quantity,
})

export default lineItemFormatter
