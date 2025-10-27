'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/gigs', label: 'Gigs' },
  { href: '/post', label: 'Post' },
  { href: '/skills', label: 'Skills' },
  { href: '/sell', label: 'Sell' },
  { href: '/wallet', label: 'Wallet' },
  { href: '/profile', label: 'Profile' },
  // Admin link intentionally removed
  { href: '/login', label: 'Login' },
]

export default function Nav() {
  const pathname = usePathname()
  return (
    <header className="w-full border-b border-white/10 bg-[#0B1220]">
      <nav className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link href="/" className="font-bold text-white">DailyEarn PH</Link>
        <ul className="flex items-center gap-5 text-sm text-gray-200">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={pathname?.startsWith(l.href) ? 'text-white font-semibold' : 'hover:text-white'}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
