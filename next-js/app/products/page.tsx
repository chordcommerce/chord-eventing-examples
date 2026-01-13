'use client'

import Image from 'next/image'
import Link from 'next/link'

import { products } from '../data/products'
import { useChord } from '@/app/hooks/useChord'

export default function ProductsPage() {
  const chord = useChord()

  const handleClick = (product: {
    id: string
    name: string
    description: string
    price: number
    brand: string
    sku: string
    categories: string[]
    images: string[]
  }) => {
    if (chord) {
      const analyticsProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        sku: product.sku,
        brand: product.brand,
        categories: product.categories,
        description: product.description,
        images: product.images,
      }
      chord.trackProductClicked({
        product: {
          product: analyticsProduct,
          quantity: 1,
          variantId: product.id,
        },
        cart: {},
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
            onClick={() => handleClick(product)}
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform group-hover:scale-105">
              <div className="relative aspect-square">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-black text-lg font-semibold mb-2">{product.name}</h2>
                <p className="text-black text-sm mb-2">{product.brand}</p>
                <p className="text-black text-xl font-bold">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
