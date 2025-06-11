import type { AnalyticsProductInput } from "@/lib/chord/analytics-types";
import type { ProductFormatter } from "@chordcommerce/analytics";

const productFormatter: ProductFormatter<AnalyticsProductInput> = ({ product, quantity }) => ({
  product_id: product.id,
  brand: product?.brand,
  name: product.name,
  price: product.price,
  quantity,
  sku: product.sku,
  category: product.categories ? product.categories[0] : undefined,
  description: product.description ?? undefined,
  image_url: product?.images?.[0],
  url: product.url ?? undefined,
});

export default productFormatter;
