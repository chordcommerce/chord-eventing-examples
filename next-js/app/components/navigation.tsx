'use client'

import Link from 'next/link'
import { useChord } from '@/app/hooks/useChord'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export function Navigation() {
  const chord = useChord()

  const handleNavClick = (item: { name: string; href: string }) => {
    if (chord) {
      chord.trackNavigationClicked({
        name: item.name,
        url: item.href,
      })
    }
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-black">
            Store
          </Link>
          <ul className="flex space-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => handleNavClick(item)}
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
