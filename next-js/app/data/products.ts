export type Product = {
  id: string
  name: string
  description: string
  price: number
  brand: string
  sku: string
  categories: string[]
  images: string[]
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic White Sneakers',
    description:
      'Timeless white sneakers perfect for everyday wear. Made with premium leather and comfortable cushioning.',
    price: 89.99,
    brand: 'UrbanSteps',
    sku: 'US-WHITE-001',
    categories: ['Shoes', 'Sneakers', 'Casual'],
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '2',
    name: 'Premium Denim Jacket',
    description:
      'Classic denim jacket with modern fit. Features premium denim construction and stylish hardware.',
    price: 129.99,
    brand: 'DenimCo',
    sku: 'DC-JACKET-001',
    categories: ['Clothing', 'Jackets', 'Denim'],
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '3',
    name: 'Smart Watch Series 5',
    description:
      'Latest generation smartwatch with health tracking, notifications, and long battery life.',
    price: 299.99,
    brand: 'TechGear',
    sku: 'TG-WATCH-005',
    categories: ['Electronics', 'Wearables', 'Smart Devices'],
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '4',
    name: 'Organic Cotton T-Shirt',
    description:
      'Soft and comfortable organic cotton t-shirt. Perfect for everyday wear.',
    price: 29.99,
    brand: 'EcoWear',
    sku: 'EW-TSHIRT-001',
    categories: ['Clothing', 'T-Shirts', 'Casual'],
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop',
    ],
  },
]
