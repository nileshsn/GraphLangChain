'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="w-full fixed top-4 z-50">
      <div className="max-w-fit mx-auto">
        <div className="bg-[#2D2D2D] rounded-full px-8 py-3 shadow-lg">
          <div className="flex space-x-8 items-center">
            {[
              ['Home', '/'],
              ['About', '/about'],
              ['Contact', '/contact'],
              ['Blog', '/blog'],
              ['Product', '/product'],
            ].map(([title, url]) => (
              <Link
                key={title}
                href={url}
                className={`${
                  pathname === url
                    ? 'text-white relative after:content-[""] after:absolute after:w-full after:h-0.5 after:bg-white after:bottom-[-4px] after:left-0'
                    : 'text-gray-300 hover:text-white relative after:content-[""] after:absolute after:w-full after:h-0.5 after:bg-white after:bottom-[-4px] after:left-0 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100'
                } transition-colors duration-200`}
              >
                {title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
} 