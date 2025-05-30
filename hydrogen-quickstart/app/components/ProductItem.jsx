import {Link} from 'react-router';
import {Image, Money, useAnalytics} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

/**
 * @param {{
 *   product:
 *     | CollectionItemFragment
 *     | ProductItemFragment
 *     | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const {publish, cart: analyticsCart} = useAnalytics();

  const handleClick = () => {
    publish('custom_product_clicked', {
      cart: analyticsCart,
      customData: {
        products: [
          {
            id: product?.id,
            title: product?.title,
            price: product?.priceRange?.minVariantPrice?.amount || '0',
            vendor: product?.vendor,
            variantId: product?.variants?.[0]?.id || '',
            variantTitle: product?.variants?.[0]?.title || '',
            quantity: 1,
            sku: product?.variants?.[0]?.sku || '',
            productType: product?.productType,
          },
        ],
      },
    });
  };
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
      onClick={handleClick}
    >
      {image && (
        <Image
          alt={image.altText || product.title}
          aspectRatio="1/1"
          data={image}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4>{product.title}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
