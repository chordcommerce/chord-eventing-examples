'use client'

import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

import { useChord } from '@/app/hooks/useChord'
import { useCart } from '@/app/contexts/cart-context'
import { products } from '@/app/data/products'

export default function ProductPage() {
  const params = useParams()
  const chord = useChord()
  const { addToCart } = useCart()
  const product = products.find((p) => p.id === params.id)

  useEffect(() => {
    if (chord && product) {
      const analyticsProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        sku: product.sku,
        brand: product.brand,
      }
      chord.trackProductViewed({
        product: {
          product: analyticsProduct,
          quantity: 1,
          variantId: product.sku,
        },
        cart: {},
      })
    }
  }, [chord, product])

  if (!product) {
    return <div>Product not found</div>
  }

  const handleAddToCart = () => {
    addToCart(product)
    if (chord && product) {
      const analyticsProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        sku: product.sku,
        brand: product.brand,
      }
      chord.trackProductAdded({
        product: {
          product: analyticsProduct,
          quantity: 1,
          variantId: product.sku,
        },
        cart: {},
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold">${product.price.toFixed(2)}</p>
          <p className="text-white">{product.description}</p>
          <div className="pt-4">
            <button
              onClick={handleAddToCart}
              className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
